# ng1x-decorators
Bringing some Angular 2 patterns to 1.x.

## Overview
This project provides TypeScript decorators to allow defining components, services, and modules in Angular 1.X
using similar patterns to those found in Angular 2.0. The decorator API is not an exact match but borrows similar patterns from 2.0.

## TODO
* Type based dependency injection

## Usage
```html
<body id="basicApp">
	<app></app>
</body>
```

```typescript
// message.component.ts
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
```

```typescript
// app.component.ts
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
```

```typescript
// app.module.ts
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
```

```typescript
// app.bootstrap.ts
import { bootstrapModule } from 'ng1x-decorators';
import { AppModule } from './app/app.module';

// bootstrap our module to the dom by an id
bootstrapModule('basicApp', AppModule);
```
