import { Player } from './player';

export interface IPlayerState {
	enter(): void;
	leave(): void;
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

	enter(): void {}

	leave(): void {}

	get playerRef(): Player {
		return this._playerRef;
	}

	get name(): string {
		return this._name || '';
	}
}

export class PlayingState extends PlayerState implements IPlayerState {
	enter(): void {
		this.playerRef.videoEl.play();
	}
}

export class StoppedState extends PlayerState implements IPlayerState {
	enter(): void {
		this.playerRef.videoEl.pause();
		this.playerRef.videoEl.currentTime = 0;
	}
}

export class PausedState extends PlayerState implements IPlayerState {
	enter(): void {
		this.playerRef.videoEl.pause();
	}
}

export class RewindingState extends PlayerState implements IPlayerState {
	enter() {
		this.playerRef.videoEl.pause();
		this.playerRef.progressEl.addEventListener('input', this.progressHandler);
	}

	leave() {
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
