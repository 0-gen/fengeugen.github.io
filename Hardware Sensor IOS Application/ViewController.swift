//
//  ViewController.swift
//  Sensored
//
//  Created by gen on 9/13/19.
//  Copyright © 2019 Eugen Feng. All rights reserved.
//

import UIKit
import CoreMotion

class ViewController: UIViewController, UIScrollViewDelegate {
    //the following outlets are our ability to scroll and change views in the same screen
    @IBOutlet weak var sensorScrollView: UIScrollView!
    @IBOutlet weak var scrollPage: UIPageControl!
    // the following is the 5 sensors consisting of their description, image, and title.
    let sensor0 = ["title":"Gyroscope","desc":"Rotational Vector (rad/s)","image":"Gyroscope"]
    let sensor1 = ["title":"Accelerometer","desc":"Speed (m/s2)","image":"Accelerometer"]
    let sensor2 = ["title":"Magnetometer","desc":"Magnetic Field (uT)","image":"Magnetometer"]
    let sensor3 = ["title":"Barometer","desc":"Pressure (hPa/psi)","image":"Barometer"]
    let sensor4 = ["title":"Proximity","desc":"Presence Detection","image":"Proximity"]
    //here we will call the CoreMotion, shorthand, when we call the functions CMMotionManager and CMAltimeter
    var motion = CMMotionManager()
    var sensorArray = [Dictionary<String,String>]()
    let altimeter = CMAltimeter()
    var counter = 0
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        sensorArray = [sensor0,sensor1,sensor2,sensor3,sensor4]
        //here we give the ability to scroll to sensorScrollView and give its size.
        sensorScrollView.isPagingEnabled = true
        sensorScrollView.contentSize = CGSize(width: self.view.bounds.width * CGFloat(sensorArray.count), height: 400)
        sensorScrollView.showsHorizontalScrollIndicator = false
        sensorScrollView.delegate = self
        
        //the following calls our functions so they can run indefinitely
        activateProximitySensor(isOn: true)
        loadSensors()

    }
    // with the use of the observer, we are allowed to detect if there is a change within the proximity sensor, if there is a change (on/off) the observer will send a notification and also perform count to trigger our events
    @objc func proximityStateDidChange(notification: NSNotification) {
        if (notification.object as? UIDevice) != nil {
                counter += 1
            }
        }
    func activateProximitySensor(isOn: Bool) {
        let device = UIDevice.current
        device.isProximityMonitoringEnabled = isOn
        if isOn {
            NotificationCenter.default.addObserver(self, selector: #selector(proximityStateDidChange), name: UIDevice.proximityStateDidChangeNotification, object: device)
        } else {
            NotificationCenter.default.removeObserver(self, name: UIDevice.proximityStateDidChangeNotification, object: device)
        }
    }
    //here is the main function where it will trigger every sensor to turn on indefinitely
    func loadSensors() {
        for _ in sensorArray {
            for(index,sensor) in sensorArray.enumerated() {
                if let sensorView = Bundle.main.loadNibNamed("Sensor", owner: self, options: nil)?.first as? SensorView {

                    sensorView.sensorImageView.image = UIImage(named: sensor["image"]!)
                    sensorView.sensorTitle.text = sensor["title"]
                    sensorView.sensorDesc.text = sensor["desc"]

                    sensorScrollView.addSubview(sensorView)
                    sensorView.frame.size.width = self.view.bounds.size.width
                    sensorView.frame.origin.x = CGFloat(index) * self.view.bounds.size.width
                    //if we are on the Gyroscope page, we will display the following datas
                    if sensorView.sensorTitle.text == "Gyroscope" {
                        motion.gyroUpdateInterval = 0.4 // this line controls how fast the data change/update
                        motion.startGyroUpdates(to: OperationQueue.current!) { (data, error) in
                    //print(data as Any) print out to console for debugging
                        if let trueData = data {
                            self.view.reloadInputViews()
                            let mPitch = trueData.rotationRate.x
                            let mRoll = trueData.rotationRate.y
                            let mYaw = trueData.rotationRate.z
                            let rad = " rad/s"
                            sensorView.xGyro.text = "X : \(Double(mPitch).rounded(toPlaces: 4))" + "\(rad)"
                            sensorView.yGyro.text = "Y : \(Double(mRoll).rounded(toPlaces: 4))" + "\(rad)"
                            sensorView.zGyro.text = "Z : \(Double(mYaw).rounded(toPlaces: 4))" + "\(rad)"
                        }
                        }
                    }
                    if sensorView.sensorTitle.text == "Accelerometer" {
                        motion.accelerometerUpdateInterval = 0.4
                        motion.startAccelerometerUpdates(to: OperationQueue.current!) { (data, error) in
                        if let trueData = data {
                            self.view.reloadInputViews()
                            //the following datas are multiplied by 10 because the raw data gives us the 10^-1 m/s2
                            let xDir = trueData.acceleration.x * 10
                            let yDir = trueData.acceleration.y * 10
                            let zDir = trueData.acceleration.z * 10
                            let speed = " m/s2"
                            sensorView.xAccel.text = "X : \(Double(xDir).rounded(toPlaces: 4))" + "\(speed)"
                            sensorView.yAccel.text = "Y : \(Double(yDir).rounded(toPlaces: 4))" + "\(speed)"
                            sensorView.zAccel.text = "Z : \(Double(zDir).rounded(toPlaces: 4))" + "\(speed)"
                        }
                        }
                    }
                    if sensorView.sensorTitle.text == "Magnetometer"{
                        motion.magnetometerUpdateInterval = 0.3
                        motion.startMagnetometerUpdates(to: OperationQueue.current!) { (data, error) in
                        if let trueData = data{
                            self.view.reloadInputViews()
                            //in the following data, the + 131, - 81 , + 130, and the division by 10 are the offset values. Since my phone emits its own internal mag. field, I compared my raw data to the sensors app and calibrated my datas with offset values.
                            let xMag = (trueData.magneticField.x + 131)/10
                            let yMag = (trueData.magneticField.y - 81)/10
                            let zMag = (trueData.magneticField.z + 130)/10
                            let uT = " uT"
                            sensorView.xMag.text = "X : \(Double(xMag).rounded(toPlaces: 4))" + "\(uT)"
                            sensorView.yMag.text = "Y : \(Double(yMag).rounded(toPlaces: 4))" + "\(uT)"
                            sensorView.zMag.text = "Z : \(Double(zMag).rounded(toPlaces: 4))" + "\(uT)"
                        }
                        }
                    }
                    if sensorView.sensorTitle.text == "Barometer"{
                        altimeter.startRelativeAltitudeUpdates(to: OperationQueue.current!) { (data, error) in
                        if let trueData = data{
                            self.view.reloadInputViews()
                            let pressure  = 10 * trueData.pressure.doubleValue
                            let hPa = " hPa"
                            sensorView.pressure.text = "Pressure : \(Double(pressure).rounded(toPlaces: 4))" + "\(hPa)"
                            let psi_val = pressure / 68.9475728 //this value represents the conversion between hPa and psi
                            let psi = " psi"
                            sensorView.pressure_psi.text = "Pressure : \(Double(psi_val).rounded(toPlaces: 4))" + "\(psi)"
                        }
                        }
                    }
                    if sensorView.sensorTitle.text == "Proximity"{
                        motion.startDeviceMotionUpdates(to: OperationQueue.current!) { (data,error) in //this is arbitrary startupdate. the purpose of this is an attempt to do an infinite loop but won't crash the app. since the start--updates all turn on in parallel, using this arbitrary update to continue to check the counter conditions.
                        if data != nil{
                            self.view.reloadInputViews()
                            if self.counter % 2 == 0{ //if nothing is near by, count will not increase, therefore display a green to indicate nothing is nearby
                                sensorView.prox.image = UIImage(named: "away")
                                //print(self.counter) for debugging purposes
                                }
                            else if self.counter % 2 != 0{ //basically if something is in proximity, displays a red circle to indicate something nearby
                                sensorView.prox.image = UIImage(named: "close")
                            }
                            }
                        }
                        }
                    }
                    }
        }
        }
    func scrollViewDidScroll(_ scrollView: UIScrollView) {
        let page = scrollView.contentOffset.x / scrollView.frame.size.width
        scrollPage.currentPage = Int(page)
    }
}
//the following allows us to display x amount of integers after the decimal point
extension Double {
    func rounded (toPlaces places:Int) -> Double {
        let divisor = pow(10.0, Double(places))
        return (self * divisor).rounded() / divisor
    }
}



