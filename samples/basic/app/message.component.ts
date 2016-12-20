import { component, input, output } from 'ng1x-decorators';

@component('message', {
	template: '<div>{{ctrl.message}}</div>'
})
export class MessageComponent {
	@input() message: string;
	@output() onMessage: (locals: {message: string}) => void;

	onClick(): void {
		this.onMessage({
			message: this.message
		});
	}
}