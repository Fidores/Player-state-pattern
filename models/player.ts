import {
	PlayerState,
	PlayingState,
	StoppedState,
	PausedState,
} from './playerStates';

export class Player {
	constructor(container: HTMLElement | string) {
		this.setupElements(container);
		this.setupEventsListeners();
		this.init();
	}
	private hostEl: HTMLElement;
	private _videoEl: HTMLVideoElement;
	private progressEl: HTMLProgressElement;
	private state: PlayerState;

	playing = new PlayingState('playing');
	stopped = new StoppedState('stopped');
	paused = new PausedState('paused');

	play() {
		this.state.play();
	}

	stop() {
		this.state.stop();
	}

	pause() {
		this.state.pause();
	}

	changeState(newState: PlayerState): void {
		if (this.state === newState) return;

		this.state.exit();
		this.state = newState;
		this.state.load();
	}

	private init() {
		[this.playing, this.stopped, this.paused].forEach(state =>
			state.init(this)
		);
		this.state = this.stopped;
	}

	private setupEventsListeners() {
		this.videEl.addEventListener('timeupdate', ({ target }) => {
			const el = target as HTMLVideoElement;
			const currentTime = el.currentTime;
			const duration = el.duration;

			this.progressEl.setAttribute('max', duration.toString());
			this.progressEl.setAttribute('value', currentTime.toString());
		});

		this.hostEl
			.querySelector('.video__play')
			.addEventListener('click', this.play.bind(this));

		this.hostEl
			.querySelector('.video__pause')
			.addEventListener('click', this.pause.bind(this));

		this.hostEl
			.querySelector('.video__stop')
			.addEventListener('click', this.stop.bind(this));
	}

	private setupElements(container: HTMLElement | string) {
		if (typeof container === 'string')
			this.hostEl = document.querySelector(container as string);
		else this.hostEl = container as HTMLElement;

		this._videoEl = this.hostEl.querySelector('.player__video');
		this.progressEl = this.hostEl.querySelector('.player__progress');
	}

	get videEl(): HTMLVideoElement {
		return this._videoEl;
	}
}
