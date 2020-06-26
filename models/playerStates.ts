import { Player } from './player';

export interface IPlayerState {
	load(): void;
	exit(): void;
	play(): void;
	stop(): void;
	pause(): void;
	rewind(): void;
}

export abstract class PlayerState implements IPlayerState {
	constructor(
		private readonly _playerRef: Player,
		private readonly _name?: string
	) {}

	play(): void {
		this._playerRef.changeState(this._playerRef.states.get('playing'));
	}

	stop(): void {
		this._playerRef.changeState(this._playerRef.states.get('stopped'));
	}

	pause(): void {
		this._playerRef.changeState(this._playerRef.states.get('paused'));
	}

	rewind(): void {
		this._playerRef.changeState(this._playerRef.states.get('rewinding'));
	}

	load(): void {
		throw new Error('Method not implemented.');
	}

	exit(): void {
		throw new Error('Method not implemented.');
	}

	get playerRef(): Player {
		return this._playerRef;
	}

	get name(): string {
		return this._name || '';
	}
}

export class PlayingState extends PlayerState implements IPlayerState {
	load(): void {
		this.playerRef.videoEl.play();
	}

	exit(): void {
		console.log(`Exiting: ${this.name}`);
	}

	play(): void {
		console.log(`Already ${this.name}`);
	}
}

export class StoppedState extends PlayerState implements IPlayerState {
	load(): void {
		this.playerRef.videoEl.pause();
		this.playerRef.videoEl.currentTime = 0;
	}

	exit(): void {
		console.log(`Exiting: ${this.name}`);
	}

	stop(): void {
		console.log(`Already ${this.name}`);
	}
}

export class PausedState extends PlayerState implements IPlayerState {
	load(): void {
		this.playerRef.videoEl.pause();
	}

	exit(): void {
		console.log(`Exiting: ${this.name}`);
	}

	pause(): void {
		console.log(`Already ${this.name}`);
	}
}

export class RewindingState extends PlayerState implements IPlayerState {
	rewind() {
		console.log(`Already ${this.name}`);
	}

	load() {
		this.playerRef.videoEl.pause();
		this.playerRef.progressEl.addEventListener('input', this.progressHandler);
	}

	exit() {
		this.playerRef.progressEl.removeEventListener(
			'input',
			this.progressHandler
		);
	}

	private progressHandler = ($event: InputEvent) => {
		const target = $event.target as HTMLInputElement;
		this.playerRef.videoEl.currentTime = parseFloat(target.value);
	};
}
