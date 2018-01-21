var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MyTogglePanel = (function (_super) {
    __extends(MyTogglePanel, _super);
    function MyTogglePanel() {
        var _this = _super.call(this) || this;
        _this._selected = true;
        _this.btn = null;
        _this.displayImg = null;
        _this.displayLabel = null;
        return _this;
    }
    MyTogglePanel.prototype.partAdded = function (partName, instance) {
        _super.prototype.partAdded.call(this, partName, instance);
    };
    MyTogglePanel.prototype.childrenCreated = function () {
        var _this = this;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
            _this.selected = !_this.selected;
        }, this);
    };
    Object.defineProperty(MyTogglePanel.prototype, "selected", {
        get: function () {
            return this._selected;
        },
        set: function (val) {
            if (this._selected == val) {
                return;
            }
            this._selected = val;
            if (this.selected) {
                this.displayLabel.text = "sel";
                this.displayImg.source = "checkbox_select_down_png";
            }
            else {
                this.displayLabel.text = "unsel";
                this.displayImg.source = "checkbox_unselect_png";
            }
        },
        enumerable: true,
        configurable: true
    });
    return MyTogglePanel;
}(eui.Component));
__reflect(MyTogglePanel.prototype, "MyTogglePanel", ["eui.UIComponent"]);
