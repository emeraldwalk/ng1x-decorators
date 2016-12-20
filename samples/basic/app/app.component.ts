import { component, input, output } from 'ng1x-decorators';

@component('app', {
	template: '<div>Hello App!</div>'
})
export class AppComponent {
	@input() message: string;
	@output() onMessageChanged: (locals: {message: string}) => void;
}