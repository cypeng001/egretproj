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

    private _preload_list: string[] = ["preload", "config"];
    private _preload_idx = 0;

    /**
     * 加载进度界面
     * loading process interface
     */
    private loadingView: LoadingUI;
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
        //Config loading process interface
        //设置加载进度界面
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        // initialize the Resource loading library
        //初始化Resource资源加载库
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }
    /**
     * 配置文件加载完成,开始预加载皮肤主题资源和preload资源组。
     * Loading of configuration file is complete, start to pre-load the theme configuration file and the preload resource group
     */
    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        // load skin theme configuration file, you can manually modify the file. And replace the default skin.
        //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
        let theme = new eui.Theme("resource/default.thm.json", this.stage);
        theme.addEventListener(eui.UIEvent.COMPLETE, this.onThemeLoadComplete, this);

        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        //RES.loadGroup("preload");

        for(let i = 0; i < this._preload_list.length; i++)
        {
            var group = this._preload_list[i];
            RES.loadGroup(group);
        }
    }
    private isThemeLoadEnd: boolean = false;
    /**
     * 主题文件加载完成,开始预加载
     * Loading of theme configuration file is complete, start to pre-load the 
     */
    private onThemeLoadComplete(): void {
        this.isThemeLoadEnd = true;
        this.createScene();
    }
    private isResourceLoadEnd: boolean = false;
    /**
     * preload资源组加载完成
     * preload resource group is loaded
     */
    private onResourceLoadComplete(event: RES.ResourceEvent): void {
        var loaded = false;

        for(let i = 0; i < this._preload_list.length; i++)
        {
            var group = this._preload_list[i];
            if(group == event.groupName)
            {
                loaded = true;
                break;
            }
        }

        if(!loaded)
        {
            console.error("onResourceLoadComplete invalid groupName", event.groupName);
            return;
        }

        this._preload_idx++;

        if (this._preload_idx == this._preload_list.length) {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.isResourceLoadEnd = true;
            this.createScene();
        }
    }
    private createScene() {
        if (this.isThemeLoadEnd && this.isResourceLoadEnd) {
            this.startCreateScene();
        }
    }
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event: RES.ResourceEvent): void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }
    /**
     * 资源组加载出错
     * Resource group loading failed
     */
    private onResourceLoadError(event: RES.ResourceEvent): void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //ignore loading failed projects
        this.onResourceLoadComplete(event);
    }
    /**
     * preload资源组加载进度
     * loading process of preload resource
     */
    private onResourceProgress(event: RES.ResourceEvent): void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }
    private textfield: egret.TextField;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected startCreateScene(): void {
        let sky = this.createBitmapByName("bg_jpg");
        this.addChild(sky);
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;

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

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);

        let button = new eui.Button();
        button.label = "Click!";
        button.horizontalCenter = 0;
        button.verticalCenter = 0;
        this.addChild(button);
        button.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onButtonClick, this);

        //this.testJSZip();
        //this.testMD5();
        //this.testMyLib();
        //this.testMyComboBox();
        //this.testMyTogglePanel();
        //this.testPomelo();
        //this.testPhp();
        //this.testLordOfPomelo();
        //this.testBezier();
        //this.testParticle();
        //this.testCustomUI();
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
        /*
        let panel = new eui.Panel();
        panel.title = "Title";
        panel.horizontalCenter = 0;
        panel.verticalCenter = 0;
        this.addChild(panel);
        */
        this.testCustomUI();
    }

    private testJSZip(): void {
        var data = RES.getRes("zip_config_zip");
        var zip = new JSZip(data);

        var item_str = zip.file("item.json").asText();
        var npc_str = zip.file("npc.json").asText();

        console.log("testJSZip item_str:", item_str);
        console.log("testJSZip npc_str:", npc_str);
    }

    private testMD5(): void {
        var md5_str:string = new md5().hex_md5("HelloMD5");
        console.log("testMD5 HelloMD5 md5_str:", md5_str);
    }

    private testMyLib(): void {
        var my_lib = new MyLib();
        var md5_str:string = my_lib.hex_md5("HelloMD5");
        console.log("testMyLib HelloMD5 md5_str:", md5_str);
        var ret = my_lib.testAdd(1, 2);
        console.log("testMyLib my_lib.testAdd ret:", ret);
        my_lib.setTestVal(100);
        var testVal = my_lib.getTestVal();
        console.log("testMyLib my_lib.getTestVal ret:", testVal);
    }

    private cb_data:any[] = [];
    private cb:MyComboBox;
    protected testMyComboBox(): void {
        //初始化数据
        this.cb_data.push({bg:"resource/ui/combobox/itemBg1.png",content:"https://www.baidu.com/"});
        this.cb_data.push({bg:"resource/ui/combobox/itemBg2.png",content:"https://www.egret.com/"});
        this.cb_data.push({bg:"resource/ui/combobox/itemBg3.png",content:"https://www.360.com/"});
        this.cb_data.push({bg:"resource/ui/combobox/itemBg4.png",content:"https://www.baidu.com/"});
        
        this.cb = new MyComboBox(this.cb_data);
        this.addChild(this.cb);
        //1.点击事件
        this.cb.addEventListener(MyComboBox.onClick,this.onMyComboBoxClick,this);
        //2.设置title
        this.cb.setTitleHeight(this.stage.stageWidth/5);
        this.cb.setTitleBackground("resource/ui/combobox/titleBackground.png");
        this.cb.setTitleFontSize(40);
        //3.设置Item
        this.cb.setItemWidth(this.stage.stageWidth);
        this.cb.setItemHeight(80);
        this.cb.setItemFontSize(30);
        //4.设置Item内容文字的对齐方式
        this.cb.setItemTextAlign("left");
        //5.展开和收起
        //this.cb.show();
        //this.cb.hide();
        
    }
    
    private onMyComboBoxClick(event){
        //getTitleLabe()方法可以获取titleLabel控件。
        var titleLabel = this.cb.getTitleLabe();
        titleLabel.text = this.cb_data[event.data.itemIndex].content;

        this.cb.hide();
        console.log(event.data);
    }

    private testMyTogglePanel(): void {
        var btn = new MyTogglePanel();
        this.addChild(btn);
    }

    private testPomelo(): void {
        var pomelo:Pomelo = new Pomelo();

        pomelo.on('io-error', function(e:any):void {
            console.error('testPomelo io-error');
        });

        pomelo.on('close', function(e:any):void {
            console.warn('testPomelo close');
        });

        pomelo.init({
            host: '127.0.0.1',
            port: '3010'
        }, function(response:any):void {
            if (response.code === 200) {
            }
        });
    }

    private testPhp(): void {
        PhpUtil.post("http://localhost:3001/login", {username: "cypeng001", password: "123456"}, 
            (result) => {
                console.log("testPhp result:", result);
            },
            (event) => {
                console.log("testPhp error event:", event);
            },
            this);
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
                    console.error('Username or password is invalid!');
                    return;
                }

                if (data.code !== 200) {
                    console.error('Username is not exists!');
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

    private testBezier(): void {
        var bezierSpline = new BezierSpline();
        //bezierSpline.init([100, 500, 300, 0, 500, 300]);
        bezierSpline.init([500, 300, 300, 0, 100, 500]);
        bezierSpline.refresh();
        this.addChild(bezierSpline);
    }

    private testParticle(): void {
        var texture = RES.getRes("particle_snow_png");
        var config = RES.getRes("particle_snow_json");
        var particleSystem = new particle.GravityParticleSystem(texture, config);
        particleSystem.x = 100;
        particleSystem.y = 100;
        particleSystem.start();
        this.addChild(particleSystem);
    }

    private testCustomUI(): void {
        var loginUI = new LoginUI;
        this.addChild(loginUI);
    }
}
