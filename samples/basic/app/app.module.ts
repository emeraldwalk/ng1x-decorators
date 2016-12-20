import { ngModule } from 'ng1x-decorators';
import { AppComponent } from './app.component';

@ngModule({
	name: 'appModule',
	dependencies: [AppComponent]
})
export class AppModule {
}