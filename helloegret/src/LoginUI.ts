/**
 * Created by egret on 2016/1/26.
 */

class LoginUI extends eui.Component{
    private loginBtn: eui.Button;
    private registerBtn: eui.Button;
    private item1: ItemUI;
    private item2: ItemUI;

    constructor() {
        super();
        this.addEventListener( eui.UIEvent.COMPLETE, this.uiCompHandler, this );
        this.skinName = "resource/custom_skins/loginUISkin.exml";
    }

    private uiCompHandler():void {
        console.log( "\t\tLoginUI uiCompHandler" );

        this.loginBtn.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            console.log("loginBtn TOUCH_TAP");
            this.item1.nameLabel.text = "Login";
        }, this);

        this.registerBtn.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            console.log("registerBtn TOUCH_TAP")
            this.item2.nameLabel.text = "Register";
        }, this);
    }

}