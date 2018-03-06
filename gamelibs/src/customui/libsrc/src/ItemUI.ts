class ItemUI extends eui.Component implements  eui.UIComponent {
	public iconBg: eui.Image;
	public icon: eui.Image;
	public nameLabel: eui.Label;
	public countLabel: eui.Label;

	public constructor() {
		super();
	}

	protected partAdded(partName:string,instance:any):void
	{
		super.partAdded(partName,instance);
	}


	protected childrenCreated():void
	{
		super.childrenCreated();
	}
	
}