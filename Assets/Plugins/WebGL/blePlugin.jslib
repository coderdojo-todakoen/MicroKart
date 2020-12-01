var blePlugin = {
    // 接続中のBluetoothデバイス
    $devices: {},

    // Bluetoothデバイスに接続中かどうかを返します
    IsConnected: function (targetName) {
        console.log('>>> isConnect');

        var target = Pointer_stringify(targetName);
        console.log('target:' + target);

        var result = false;

        if (devices[target]) {
            console.log('device:' + devices[target]);
            result = devices[target].gatt.connected;
        }

        console.log('<<< isConnect');

        return result;
    },

    // Bluetoothデバイスに接続します
    Connect: function (targetName) {
        console.log('>>> connect');

        var target = Pointer_stringify(targetName);
        console.log('target:' + target);

        var ACCELEROMETER_SERVICE_UUID = 'e95d0753-251d-470a-a062-fa1922dfa9a8';
        var ACCELEROMETER_DATA_CHARACTERISTIC_UUID = 'e95dca4b-251d-470a-a062-fa1922dfa9a8';
        var ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID = 'e95dfb24-251d-470a-a062-fa1922dfa9a8';
        var BUTTON_SERVICE_UUID = 'e95d9882-251d-470a-a062-fa1922dfa9a8';
        var BUTTON_A_STATE_CHARACTERISTIC_UUID = 'e95dda90-251d-470a-a062-fa1922dfa9a8';
        var BUTTON_B_STATE_CHARACTERISTIC_UUID = 'e95dda91-251d-470a-a062-fa1922dfa9a8';

        var bluetoothServer;
        var accelerometerService;
        var buttonService;

        // Bluetoothデバイスを取得します
        var options = {
            filters: [
                { namePrefix: 'BBC micro:bit' }
            ],
            optionalServices: [ACCELEROMETER_SERVICE_UUID, BUTTON_SERVICE_UUID]
        };
        navigator.bluetooth.requestDevice(options)
            .then(function (device) {
                console.log('id:' + device.id);
                console.log('name:' + device.name);

                // 接続が切れたら通知を受け取ります
                device.addEventListener('gattserverdisconnected', function (e) {
                    console.log('gattserverdisconnected');
                    SendMessage(target, 'OnDisconnected');
                });

                // デバイスに接続します
                return device.gatt.connect();
            })
            .then(function (server) {
                console.log('connected.');
                devices[target] = server.device;

                // 加速度計サービスを取得します
                bluetoothServer = server;
                return bluetoothServer.getPrimaryService(ACCELEROMETER_SERVICE_UUID);
            })
            .then(function (service) {
                console.log('getPrimaryService');

                accelerometerService = service;
                return accelerometerService.getCharacteristic(ACCELEROMETER_PERIOD_CHARACTERISTIC_UUID);
            })
            .then(function (characteristic) {
                console.log('getCharacteristic');

                // 加速度計の値の取得間隔を設定します
                var period = new Uint16Array([20]);
                return characteristic.writeValue(period);
            })
            .then(function () {
                console.log('writeValue');

                return accelerometerService.getCharacteristic(ACCELEROMETER_DATA_CHARACTERISTIC_UUID);
            })
            .then(function (characteristic) {
                console.log('getCharacteristic');

                // 加速度計の値の取得を開始します
                return characteristic.startNotifications();
            })
            .then(function (characteristic) {
                console.log('startNotifications');

                // 加速度計の値を受け取ります
                characteristic.addEventListener('characteristicvaluechanged', function (ev) {
                    var value = ev.target.value;
                    var x = value.getInt16(0, true);
                    var y = value.getInt16(2, true);
                    var z = value.getInt16(4, true);
                    // 加速度計のx方向の値をUnityのオブジェクトへ通知します
                    // x方向の値をmicro:bitの傾きとして処理します
                    SendMessage(target, 'OnAccelerometerChanged', x);
                });

                // ボタンサービスを取得します
                return bluetoothServer.getPrimaryService(BUTTON_SERVICE_UUID);
            })
            .then(function (service) {
                console.log('getPrimaryService');

                buttonService = service;
                return buttonService.getCharacteristic(BUTTON_A_STATE_CHARACTERISTIC_UUID);
            })
            .then(function (characteristic) {
                console.log('getCharacteristic');

                // ボタンAの通知の取得を開始します
                return characteristic.startNotifications();
            })
            .then(function (characteristic) {
                console.log('startNotifications');

                // ボタンAの通知を受け取ります
                characteristic.addEventListener('characteristicvaluechanged', function (ev) {
                    var value = ev.target.value;
                    var state = value.getUint8();
                    // ボタンAの状態をUnityのオブジェクトへ通知します
                    SendMessage(target, 'OnButtonAChanged', state);
                });

                return buttonService.getCharacteristic(BUTTON_B_STATE_CHARACTERISTIC_UUID);
            })
            .then(function (characteristic) {
                console.log('getCharacteristic');

                // ボタンBの通知の取得を開始します
                return characteristic.startNotifications();
            })
            .then(function (characteristic) {
                console.log('startNotifications');

                // ボタンBの通知を受け取ります
                characteristic.addEventListener('characteristicvaluechanged', function (ev) {
                    var value = ev.target.value;
                    var state = value.getUint8();
                    // ボタンBの状態をUnityのオブジェクトへ通知します
                    SendMessage(target, 'OnButtonBChanged', state);
                });
            })
            .catch(function (err) {
                console.log('err:' + err);

                if (devices[target]) {
                    if (devices[target].gatt.connected) {
                        devices[target].gatt.disconnect();
                    }
                    delete devices[target];
                }
            });

        console.log('<<< connect');
    },

    // Bluetoothデバイスを切断します
    Disconnect: function (targetName) {
        console.log('>>> disconnect');

        var target = Pointer_stringify(targetName);
        console.log('target:' + target);

        if (devices[target]) {
            console.log('device:' + devices[target]);
            // デバイスに接続中なら切断します
            devices[target].gatt.disconnect();
            delete devices[target];
        }

        console.log('<<< disconnect');
    }
};
autoAddDeps(blePlugin, '$devices');
mergeInto(LibraryManager.library, blePlugin);
