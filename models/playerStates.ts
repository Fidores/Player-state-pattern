import { Player } from './player';

export interface IPlayerState {
	load(): void;
	exit(): void;
	play?(): void;
	stop?(): void;
	pause?(): void;
}

export class PlayerState implements IPlayerState {
	constructor(private readonly _name?: string) {}
	private _playerRef: Player;

	init(playerRef) {
		this._playerRef = playerRef;
	}

	play(): void {
		this._playerRef.changeState(this._playerRef.playing);
	}

	stop(): void {
		this._playerRef.changeState(this._playerRef.stopped);
	}

	pause(): void {
		this._playerRef.changeState(this._playerRef.paused);
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
		this.playerRef.videEl.play();
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
		this.playerRef.videEl.pause();
		this.playerRef.videEl.currentTime = 0;
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
		this.playerRef.videEl.pause();
	}

	exit(): void {
		console.log(`Exiting: ${this.name}`);
	}

	pause(): void {
		console.log(`Already ${this.name}`);
	}
}
