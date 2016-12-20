import { ngModule } from 'ng1x-decorators';
import { AppComponent } from './app.component';
import { MessageComponent } from './message.component';

@ngModule({
	name: 'appModule',
	dependencies: [
		AppComponent,
		MessageComponent
	]
})
export class AppModule {
}