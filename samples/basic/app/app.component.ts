import { component, input, output } from 'ng1x-decorators';

@component('app', {
	template: `<div>
	<message name="\'hello\'" on-message="$ctrl.onMessage(message)"></message>
</div>`
})
export class AppComponent {
	public onMessage(message: string): void {
		alert(message);
	}
}