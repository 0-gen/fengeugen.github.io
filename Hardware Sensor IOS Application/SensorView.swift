//
//  SensorView.swift
//  Sensored
//
//  Created by gen on 9/13/19.
//  Copyright © 2019 Eugen Feng. All rights reserved.
//

import UIKit

class SensorView: UIView {

    @IBOutlet weak var sensorTitle: UILabel!
    @IBOutlet weak var sensorDesc: UILabel!
    @IBOutlet weak var sensorImageView: UIImageView! //this declares the imageview, allowing sensorImageView display any sensors depending on the scroll page
    
    //the following are the x y z datas we will display through a label
    @IBOutlet weak var xGyro: UILabel!
    @IBOutlet weak var yGyro: UILabel!
    @IBOutlet weak var zGyro: UILabel!
    @IBOutlet weak var xAccel: UILabel!
    @IBOutlet weak var yAccel: UILabel!
    @IBOutlet weak var zAccel: UILabel!
    @IBOutlet weak var xMag: UILabel!
    @IBOutlet weak var yMag: UILabel!
    @IBOutlet weak var zMag: UILabel!
    
    //the following displays the pressure
    @IBOutlet weak var pressure: UILabel!
    @IBOutlet weak var pressure_psi: UILabel!
    
    //the following displays the proximity
    @IBOutlet weak var prox: UIImageView!
}
