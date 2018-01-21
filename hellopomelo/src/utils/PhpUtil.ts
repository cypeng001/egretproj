class PhpUtil {
    private static param_count(param: Object): number
    {
        var count = 0;
        for(var k in param)
        {
            count++;
        }
        return count;
    }
    private static param_2_str(param: Object): string
    {
        var ret = "";
        var i = 0;
        var count = PhpUtil.param_count(param);
        for(var k in param)
        {
            var v = param[k];
            ret += (k + "=" + v);
            i++;
            if(i < count)
            {
                ret += ("&");
            }
        }
        return ret;
    }

    public static post(url: string, param: Object, handleFunc:Function, errorFunc:Function, thisObject: Object): void 
    {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(url, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        var param_str = PhpUtil.param_2_str(param);
        request.send(param_str);

        function onPostResult(event: egret.Event):void {
            var request = <egret.HttpRequest>event.currentTarget;
            var result = JSON.parse(request.response);
            handleFunc.call(thisObject, result);
        }

        function onPostFail(event: egret.IOErrorEvent):void {
            errorFunc.call(thisObject, event);
        }

        request.addEventListener(egret.Event.COMPLETE, onPostResult, null);
        request.addEventListener(egret.IOErrorEvent.IO_ERROR, onPostFail, null);
    }
}
