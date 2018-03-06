declare class ItemUI extends eui.Component implements eui.UIComponent {
    iconBg: eui.Image;
    icon: eui.Image;
    nameLabel: eui.Label;
    countLabel: eui.Label;
    constructor();
    protected partAdded(partName: string, instance: any): void;
    protected childrenCreated(): void;
}
