declare class MyTogglePanel extends eui.Component implements eui.UIComponent {
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
    selected: boolean;
    private _selected;
    btn: eui.Button;
    displayImg: eui.Image;
    displayLabel: eui.Label;
}
