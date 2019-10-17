const UUID = java.util.UUID;
const BluetoothAdapter = android.bluetooth.BluetoothAdapter;

export class Printer {

    constructor(address,uuid){
        this.PRINTER_UUID = uuid || UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");
        this.ADDRESS = address || "00:11:22:33:44:55";
        this.ALIGNMODE = { LEFT:0, CENTER:1, RIGHT:2 };
        this.btAdapter = BluetoothAdapter.getDefaultAdapter();
        this.device = this.getDevice();
        this.status = (!!this.btAdapter && !!this.device);
    }

    getDevice(){
        if(this.btAdapter){
            let btDevices = this.btAdapter.getBondedDevices().toArray();
            for(let i = 0; i < btDevices.length; i++) {
                if (btDevices[i].getAddress() === this.ADDRESS)
                    return btDevices[i];
            }
        }
        return null;
    }

    arrayToNativeByteArray(array) {
        let length = array.length;
        let result = Array.create('byte', length);
        for (let i = 0; i < length; i++) {
            result[i] = array[i];
        }
        return result;
    }

    print(data) {
        let socket = this.device.createRfcommSocketToServiceRecord(this.PRINTER_UUID);
        socket.connect(); let outputStream = socket.getOutputStream();
        let bytes = this.arrayToNativeByteArray(data);
        outputStream.write(bytes,0,bytes.length);
        outputStream.close(); socket.close();
    }

    INIT(){ return [27,64] };
    LF(n){ return Array(n|| 1).fill(10); };
    FP(n){ return [27,74,n] };
    LS(n){ return (n === undefined) ? [27,50] : [27,51,n] };
    ALIGN(n){ return [27,97,n || 0] };
    BLANK(n){ return [27,66,n || 0] };
    MODE(n){ return [27,33,n || 0] };
    DOUBLEWIDTHON(){ return [27,14] };
    DOUBLEWIDTHOFF(){ return [27,20] };
    UPDOWNON(){ return [27,123,1] };
    UPDOWNOFF(){ return [27,123,0] };
    REVERSEON(){ return [29,66,1] };
    REVERSEOFF(){ return [29,66,0] };
    UNDERLINEON(w){ return [27,45,w || 1] };
    UNDERLINEOFF(){ return [27,45,0] };
    BOLDON(){ return [27,69,15] };
    BOLDOFF(){ return [27,69,0] };
    SIZEON(s){ return [29,33,(parseInt(s) || 1) * 17] };
    SIZEOFF(){ return [29,33,0] };
    CUT(){ return [29,86,65,0] };
    CUTPARTIAL(){ return [29,86,66,0] };
    DRAWER(){ return [16,20,0,0,0] }
    LEFTON(){ return this.ALIGN(this.ALIGNMODE.LEFT); };
    LEFTOFF(){ return this.ALIGN(this.ALIGNMODE.LEFT); };
    CENTERON(){ return this.ALIGN(this.ALIGNMODE.CENTER); };
    CENTEROFF(){ return this.ALIGN(this.ALIGNMODE.LEFT); };
    RIGHTON(){ return this.ALIGN(this.ALIGNMODE.RIGHT); };
    RIGHTOFF(){ return this.ALIGN(this.ALIGNMODE.LEFT); };

    HL(t){ return Array(32).fill(this.TEXT(t || '-')[0]) }

    TEXT(t){ return String(t).split("").map(c => String(c).charCodeAt(0)) };
    LEFT(t){ return this.LEFTON().concat(this.TEXT(t)) };
    CENTER(t){ return this.CENTERON().concat(this.TEXT(t)).concat(this.CENTEROFF()) };
    RIGHT(t){ return this.RIGHTON().concat(this.TEXT(t)).concat(this.RIGHTOFF()) };
    UNDERLINE(t,w){ return this.UNDERLINEON(w).concat(this.TEXT(t)).concat(this.UNDERLINEOFF()) };
    BOLD(t){ return this.BOLDON().concat(this.TEXT(t)).concat(this.BOLDOFF()) };
    SIZE(s,t){ return this.SIZEON(s).concat(this.TEXT(t)).concat(this.SIZEOFF()) };

    DECORATE(t,dArray){
        let onApply = dArray.reduce((acc,name) => acc.concat(this[name.toUpperCase()+'ON']()),[]);
        let text = this.TEXT(t);
        let offApply = dArray.reverse().reduce((acc,name) => acc.concat(this[name.toUpperCase()+'OFF']()),[]);
        return onApply.concat(text).concat(offApply);
    }
}

global.printer = new Printer();

export function print(data,tried){
    if(!printer.status){
        if(tried) return alert('Seems Bluetooth is not turned on OR Printer is not accessible!');
        global.printer = new Printer();
        return print(data,true);
    } else {
        if(arguments.length){
            let cmd = printer.INIT(); for(let i = 0; i < arguments.length; i++){
                if(Array.isArray(arguments[i])) cmd = cmd.concat(arguments[i]);
                else cmd = cmd.concat(printer.TEXT(arguments[i]));
            }
            return printer.print(cmd.concat(Array(2).fill(10)).concat(printer.CUTPARTIAL()).concat(printer.DRAWER()));
        }
    }
}