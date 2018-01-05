class MyTogglePanel extends eui.Component implements  eui.UIComponent {
	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
			this.selected = !this.selected;
		}, this);
	}

	get selected() {
		return this._selected;
	}
	
	set selected(val: boolean) {
		if(this._selected == val)
		{
			return;
		}
		this._selected = val;

		if(this.selected)
		{
			this.displayLabel.text = "sel";
			this.displayImg.source = "checkbox_select_down_png";
		}
		else
		{
			this.displayLabel.text = "unsel";
			this.displayImg.source = "checkbox_unselect_png";
		}
	}

	private _selected: boolean = true;

	public btn: eui.Button = null;
	public displayImg: eui.Image = null;
	public displayLabel: eui.Label = null;
	
}