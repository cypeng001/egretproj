class BezierSpline extends egret.DisplayObjectContainer {
    private static DEF_SECTION: number = 10;
    private _ctrlPts: Array<number> = [];
    private _shp: egret.Shape = null;
    
    public constructor() {
        super();

        this._shp = new egret.Shape();
        this.addChild(this._shp);
    }

    private static _bezierat2(a: number, b: number, c: number, t: number): number {
		return Math.pow(1-t,2)*a + 
            2*t*(1-t)*b + 
            Math.pow(t,2)*c;
	}
    
	private static _bezierat3(a: number, b: number, c: number, d: number, t: number): number {
		return Math.pow(1-t,3) * a + 
				3*t*(Math.pow(1-t,2))*b + 
				3*Math.pow(t,2)*(1-t)*c +
				Math.pow(t,3)*d;
	}

    public init(ctrlPts: Array<number>): void {
        this._ctrlPts = ctrlPts;
    }

    public refresh(): void {
        this._shp.graphics.lineStyle(2, 0x00ff00 );
        this._shp.graphics.moveTo(this._ctrlPts[0], this._ctrlPts[1]);
        for(var i = 1; i <= BezierSpline.DEF_SECTION; ++i) {
            var t = i / BezierSpline.DEF_SECTION;
            var tx = BezierSpline._bezierat2(this._ctrlPts[0], this._ctrlPts[2], this._ctrlPts[4], t);
            var ty = BezierSpline._bezierat2(this._ctrlPts[1], this._ctrlPts[3], this._ctrlPts[5], t);
            this._shp.graphics.lineTo(tx, ty);
        }

        this._shp.graphics.endFill();
    }
}
