import { Buffer } from 'buffer';
import { BleManager } from 'react-native-ble-plx';
import { CONFIG } from '../data/config';

export default class MyBleManager {
  static instance =
    MyBleManager.instance == null ? new MyBleManager() : MyBleManager.instance;

  constructor() {
    this.manager = new BleManager();
  }

  CONTROL_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
  CONTROL_CHAR0_UUID = '4fafc202-1fb5-459e-8fcc-c5c9c331914b';
  CONTROL_CHAR1_UUID = '4fafc203-1fb5-459e-8fcc-c5c9c331914b';

  STATUS_SERVICE_UUID = '4fafc206-1fb5-459e-8fcc-c5c9c331914b';
  STATUS_CHAR0_UUID = '4fafc207-1fb5-459e-8fcc-c5c9c331914b';
  STATUS_CHAR1_UUID = '4fafc208-1fb5-459e-8fcc-c5c9c331914b';
  STATUS_CHAR2_UUID = '4fafc209-1fb5-459e-8fcc-c5c9c331914b';

  OTA_SERVICE_UUID = '4fafc211-1fb5-459e-8fcc-c5c9c331914b';
  OTA_CHAR0_UUID = '4fafc212-1fb5-459e-8fcc-c5c9c331914b';
  OTA_CHAR1_UUID = '4fafc213-1fb5-459e-8fcc-c5c9c331914b';
  OTA_CHAR2_UUID = '4fafc214-1fb5-459e-8fcc-c5c9c331914b';
  OTA_CHAR3_UUID = '4fafc215-1fb5-459e-8fcc-c5c9c331914b';

  pulseWidthChar = 'A';
  frequencyChar = 'B';
  leftIntensityChar = 'C';
  rightIntensityChar = 'D';
  durOnChar = 'E';
  durOffChar = 'F';
  waveformChar = 'G';
  outModeChar = 'H';
  totalDurationChar = 'I';
  voltageChar = 'J';

  //Ble Manager
  manager = null;

  //Scan status
  isSearching = false;

  //Device to connect to
  connectedDevice = null;

  //Connect status
  isConnected = false;

  //Interval to retry connection
  connTryInterval = 1500;

  isSearchedForResearchers = false;

  connectDevice() {
    if (this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.info('Scan Error: ' + error);
        return;
      }
      if (device.name && device.name.includes('Vagustim')) {
        this.stopSearch();
        console.info(device.name);
        console.info('Found Vagustim');

        device
          .connect()
          .then(() => {
            //Bluetooth config
            device.requestConnectionPriority(1);
            device.requestMTU(517);

            try {
              device.discoverAllServicesAndCharacteristics().then(() => {
                console.info('Connected to: ' + device.name);
                console.info('At address: ' + device.id);

                this.connectedDevice = device;
                this.isConnected = true;
                CONFIG.otaInProgress = false;

                device.onDisconnected((dcError, disconnectedDevice) => {
                  if (dcError) {
                    return;
                  }

                  console.info("Device dc'd");
                  this.cancelAllTransactions();
                  this.isConnected = false;
                });
              });
            } catch (discoverError) {
              console.info('Ble Lib Discover Fail: ' + discoverError);
              this.stopSearch();
              setTimeout(() => {
                this.connectDevice();
              }, this.connTryInterval);
            }
          })
          .catch((connectError) => {
            console.info('Ble Lib Conn Fail: ' + connectError);
            this.stopSearch();
            setTimeout(() => {
              this.connectDevice();
            }, this.connTryInterval);
          });
      }
    });
  }

  connectSelectedDevice(selectedDeviceName, priority) {
    this.cleanUp();
    if (this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.info('Scan Error: ' + error);
        return;
      }
      if (device.name && device.name.includes(selectedDeviceName)) {
        this.stopSearch();
        console.info(device.name);
        console.info('Found Vagustim');

        device
          .connect()
          .then(() => {
            //Bluetooth config
            device.requestConnectionPriority(priority);
            device.requestMTU(517);

            try {
              device.discoverAllServicesAndCharacteristics().then(() => {
                console.info('Connected to: ' + device.name);
                console.info('At address: ' + device.id);

                this.connectedDevice = device;
                this.isConnected = true;
                CONFIG.otaInProgress = false;

                device.onDisconnected((dcError, disconnectedDevice) => {
                  if (dcError) {
                    return;
                  }

                  console.info("Device dc'd");
                  this.cancelAllTransactions();
                  this.isConnected = false;
                });
              });
            } catch (discoverError) {
              console.info('Ble Lib Discover Fail: ' + discoverError);
              this.stopSearch();
              setTimeout(() => {
                this.connectDevice();
              }, this.connTryInterval);
            }
          })
          .catch((connectError) => {
            console.info('Ble Lib Conn Fail: ' + connectError);
            this.stopSearch();
            setTimeout(() => {
              this.connectDevice();
            }, this.connTryInterval);
          });
      }
    });
  }

  searchDevices() {
    this.cleanUp();
    console.info('Searching Devices');
    console.info(CONFIG.deviceList[0]["data"]);
    if (this.isSearching) {
      return;
    }

    this.isSearching = true;
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.info('Scan Error: ' + error);
        return;
      }
      if (device.name && device.name.includes('Vagustim') && !CONFIG.deviceList[0]["data"].find(element => element.name === device.name)) {
        //this.stopSearch();
        console.info(device.name);
        console.info('Found Vagustim');
        CONFIG.deviceList[0]["data"].push({ name: device.name });
        console.info(CONFIG.deviceList);
      }
    });

    setTimeout(() => {
      console.info("Stop device scan");
      this.manager.stopDeviceScan();
      this.isSearchedForResearchers = true;
    }, 5000);
  }

  writeStringData = (updateString, serviceUUID, charUUID) => {
    if (this.connectedDevice !== null) {
      let encodedAuth = new Buffer(updateString).toString('base64');
      return this.connectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        charUUID,
        encodedAuth,
      );
    }
  };

  stopSearch() {
    this.isSearching = false;

    if (this.manager) {
      this.manager.stopDeviceScan();
    }
  }

  cleanUp() {
    if (this.manager) {
      this.manager.stopDeviceScan();
      this.cancelAllTransactions();

      if (this.connectedDevice !== null) {
        this.connectedDevice.cancelConnection().then(() => {
          this.connectedDevice = null;
        });
      }

      this.isSearching = false;
      this.isConnected = false;
    }
  }

  cancelAllTransactions() {
    this.manager.cancelTransaction(this.CONTROL_CHAR0_UUID);
    this.manager.cancelTransaction(this.CONTROL_CHAR1_UUID);
    this.manager.cancelTransaction(this.STATUS_CHAR0_UUID);
    this.manager.cancelTransaction(this.STATUS_CHAR1_UUID);
    this.manager.cancelTransaction(this.STATUS_CHAR2_UUID);
    this.manager.cancelTransaction(this.OTA_CHAR0_UUID);
    this.manager.cancelTransaction(this.OTA_CHAR1_UUID);
    this.manager.cancelTransaction(this.OTA_CHAR2_UUID);
  }
}
