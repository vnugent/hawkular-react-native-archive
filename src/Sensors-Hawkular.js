import { Accelerometer, Gyroscope } from 'react-native-sensors';
import { RateLimiter }  from 'limiter';
import _ from 'lodash';


const accelerationObservable = new Accelerometer({
  updateInterval: 300, 
});


const accelerometer =(fn, threshold) => {
    
    var lastSpeed=0;

    if (threshold === undefined) {
        threshold = 5;
    }

    accelerationObservable
        .map(({ x, y, z }) => Math.abs(x + y + z - lastSpeed))
        .filter(speed => speed >= threshold)
        .subscribe(speed => {
            lastSpeed = speed;
            fn(speed);
        });
}


class HawkularAccelerometer {

    constructor(hawkular, options={pushInterval: 5000}) {
        this.pushInterval = options.pushInterval;
        this.hawkular = hawkular;
        this.accelerometer = accelerometer(_.throttle(this.pushData, this.pushInterval));
        this.started = false;
        console.log("HawkularAccelerometer initiated");
    }


    start = () => {
        this.started = true;
    }


    stop = () => {
        this.started = false;
    }


    pushData = (speed) => {
        console.log("speed ", speed);
        this.hawkular.pushGauge('speed', Math.round(speed));
    }


}


module.exports = {
  accelerometer: accelerometer,
  HawkularAccelerometer: HawkularAccelerometer
};