//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json")
        this.startAnimation(result);
        await platform.login();
        const userInfo = await platform.getUserInfo();
        console.log(userInfo);

    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

		/*

        let topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);

        let icon: egret.Bitmap = this.createBitmapByName("egret_icon_png");
        this.addChild(icon);
        icon.x = 26;
        icon.y = 33;

        let line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 172;
        line.y = 61;
        this.addChild(line);


        let colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Hello Egret";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);

        let textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;

        let button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        this.testLordOfPomelo();
		*/

		//this.testImg();
        this.testColorFilter();
    }
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result: Array<any>): void {
        let parser = new egret.HtmlTextParser();

        let textflowArr = result.map(text => parser.parse(text));
        let textfield = this.textfield;
        let count = -1;
        let change = () => {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            let textFlow = textflowArr[count];

            // 切换描述内容
            // Switch to described content
            textfield.textFlow = textFlow;
            let tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, this);
        };

        change();
    }

    /**
     * 点击按钮
     * Click the button
     */
    private onButtonClick(e: egret.TouchEvent) {
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
    }

    private static LOP_CONFIG: any = {
        WEB_SERVER_URL: "http://localhost:3001/",

        GATE_HOST: "127.0.0.1",
        GATE_PORT: 3014,
    }

    private _pomelo:Pomelo = new Pomelo();
    public get pomelo(): Pomelo {
        return this._pomelo;
    }

    private testLordOfPomelo(): void {
        this.login("cypeng001", "123456");
    }

    private login(username: string, pwd: string): void {
        PhpUtil.post(Main.LOP_CONFIG.WEB_SERVER_URL + "login", {username: username, password: pwd}, 
            (data) => {
                console.log("testPhp data:", data);

                if (data.code === 501) {
                    alert('Username or password is invalid!');
                    return;
                }

                if (data.code !== 200) {
                    alert('Username is not exists!');
                    return;
                }

                this.authEntry(data.uid, data.token, function() {
                    console.log("authEntry callback");
                });

            },
            (event) => {
                console.log("testPhp error event:", event);
            },
            this);
    }

    private authEntry(uid: string, token: string, callback: Function) {
        var self = this;
        self.queryEntry(uid, function(host, port) {
            self.entry(host, port, token, callback);
        });
    }

    private queryEntry(uid: string, callback: Function) {
        var self = this;
	
        self.pomelo.init({host: Main.LOP_CONFIG.GATE_HOST, port: Main.LOP_CONFIG.GATE_PORT, log: true}, function() {
		    console.log("pomelo.init finish");

		    console.log("gate.gateHandler.queryEntry");

            self.pomelo.request('gate.gateHandler.queryEntry', { uid: uid}, function(data) {
			    console.log("gate.gateHandler.queryEntry cb data:", data);

                self.pomelo.disconnect();

                if(data.code === 2001) {
                    alert('Servers error!');
                    return;
                }

                callback(data.host, data.port);
            });
        });
    }

    private entry(host: string, port: number, token: string, callback: Function): void {
		console.log("entry");

        var self = this;

	    console.log("pomelo.init start", {host: host, port: port, log: true});
        self.pomelo.init({host: host, port: port, log: true}, function() {
		    console.log("pomelo.init finish");

		    console.log("connector.entryHandler.entry");

            self.pomelo.request('connector.entryHandler.entry', {token: token}, function(data) {
			    console.log("connector.entryHandler.entry cb data:", data);
                var player = data.player;

                if (callback) {
                    callback(data.code);
                }

                if (data.code == 1001) {
                    alert('Login fail!');
                    return;
                } else if (data.code == 1003) {
                    alert('Username not exists!');
                    return;
                }

                if (data.code != 200) {
                    alert('Login Fail!');
                    return;
                }
            });
        });
    }

	private testImg(): void {
        var img = new eui.Image;
        img.source = "resource/item/1.png";
        img.x = 100;
        img.y = 200;
        img.scaleX = img.scaleY = 2;
        img.rotation = 30;
        this.addChild(img);
    }

    private testColorFilter(): void {
        var img = new eui.Image;
        img.source = "resource/item/1.png";
        img.x = 100;
        img.y = 200;
        img.scaleX = img.scaleY = 2;
        img.rotation = 30;

        /*
        var colorMatrix = [
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0.3,0.6,0,0,0,
            0,0,0,1,0
        ];
        var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);

        img.filters = [colorFlilter];
        */
        var colorEnhance = new egret.ColorEnhanceFilter(0.5);
        img.filters = [colorEnhance];
        
        this.addChild(img);
    }
}
