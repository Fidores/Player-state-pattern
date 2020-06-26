import {
	PlayerState,
	PlayingState,
	StoppedState,
	PausedState,
	RewindingState,
} from './playerStates';

export class Player {
	constructor(container: HTMLElement | string) {
		this.setupElements(container);
		this.setupEventsListeners();
		this.setupStates();
	}
	private state: PlayerState;
	private readonly _elements: Map<string, HTMLElement> = new Map();
	private readonly _states: Map<string, PlayerState> = new Map();

	play() {
		this.state.play();
	}

	stop() {
		this.state.stop();
	}

	pause() {
		this.state.pause();
	}

	rewind() {
		this.state.rewind();
	}

	changeState(newState: PlayerState): void {
		if (this.state === newState) return;

		this.state.leave();
		this.state = newState;
		this.state.enter();
	}

	private setupStates(): void {
		this._states.set('playing', new PlayingState(this, 'playing'));
		this._states.set('stopped', new StoppedState(this, 'stopped'));
		this._states.set('paused', new PausedState(this, 'paused'));
		this._states.set('rewinding', new RewindingState(this, 'rewinding'));

		this.state = this._states.get('stopped');
	}

	private setupEventsListeners(): void {
		this.videoEl.addEventListener(
			'timeupdate',
			this.updateVideoProgress.bind(this)
		);

		this._elements.get('play').addEventListener('click', this.play.bind(this));

		this._elements
			.get('pause')
			.addEventListener('click', this.pause.bind(this));

		this._elements.get('stop').addEventListener('click', this.stop.bind(this));

		this._elements
			.get('progress')
			.addEventListener('mousedown', this.rewind.bind(this));

		this._elements
			.get('progress')
			.addEventListener('mouseup', this.play.bind(this));
	}

	private setupElements(container: HTMLElement | string): void {
		if (typeof container === 'string')
			this._elements.set('host', document.querySelector(container as string));
		else this._elements.set('host', container as HTMLElement);

		const hostEl = this._elements.get('host');

		this._elements.set('video', hostEl.querySelector('.player__video'));
		this._elements.set('progress', hostEl.querySelector('.player__progress'));
		this._elements.set('stop', hostEl.querySelector('.player__stop'));
		this._elements.set('play', hostEl.querySelector('.player__play'));
		this._elements.set('pause', hostEl.querySelector('.player__pause'));
	}

	private updateVideoProgress(): void {
		const videoEl = this._elements.get('video') as HTMLVideoElement;
		const progressEl = this._elements.get('progress') as HTMLProgressElement;
		const { currentTime, duration } = videoEl;

		progressEl.setAttribute('max', duration.toString());
		progressEl.value = currentTime;
	}

	get videoEl(): HTMLVideoElement {
		return this._elements.get('video') as HTMLVideoElement;
	}

	get states(): Map<string, PlayerState> {
		return this._states;
	}

	get progressEl(): HTMLInputElement {
		return this._elements.get('progress') as HTMLInputElement;
	}
}
