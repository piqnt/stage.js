export declare const math: any;
export interface MatrixValue {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
}
export interface Vec2Value {
	x: number;
	y: number;
}
export declare class Matrix {
	a: number;
	b: number;
	c: number;
	d: number;
	e: number;
	f: number;
	constructor(a: number, b: number, c: number, d: number, e: number, f: number);
	constructor(m: MatrixValue);
	constructor();
	toString(): string;
	clone(): Matrix;
	reset(a: number, b: number, c: number, d: number, e: number, f: number): this;
	reset(m: MatrixValue): this;
	identity(): this;
	rotate(angle: number): this;
	translate(x: number, y: number): this;
	scale(x: number, y: number): this;
	skew(x: number, y: number): this;
	concat(m: MatrixValue): this;
	inverse(): Matrix;
	map(p: Vec2Value, q?: Vec2Value): Vec2Value;
	mapX(x: number | Vec2Value, y?: number): number;
	mapY(x: number | Vec2Value, y?: number): number;
}
export type TextureSource = Texture | CanvasImageSource;
/**
 * Textures are used to clip and resize a drawable object, for example atlas sprites.
 */
export declare class Texture {
	width: number;
	height: number;
	top: number;
	bottom: number;
	left: number;
	right: number;
	constructor(source?: TextureSource, pixelRatio?: number);
	pipe(): Texture;
	setSourceImage(image: TextureSource, pixelRatio?: number): void;
	setSourceCoordinate(x: number, y: number): void;
	setSourceDimension(w: number, h: number): void;
	setDestinationCoordinate(x: number, y: number): void;
	setDestinationDimension(w: number, h: number): void;
	/**
	 * Signatures:
	 * - (): This is used when a sprite draws its textures
	 * - (sx, sy, sw, sh, dx, dy, dw, dh): This is used when a piped texture passes drawing to it backend.
	 * - (dx, dy, dw, dh): I guess unused.
	 *
	 * Note: sx and sy are added to this._sx and this._sy.
	 */
	draw(context: CanvasRenderingContext2D): void;
	draw(context: CanvasRenderingContext2D, x1: number, y1: number, w1: number, h1: number): void;
	draw(context: CanvasRenderingContext2D, x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): void;
}
export type TextureSelectionInputOne = Texture | AtlasTextureDefinition | string;
export type TextureSelectionInputMap = Record<string, TextureSelectionInputOne>;
export type TextureSelectionInputArray = TextureSelectionInputOne[];
export type TextureSelectionInputFactory = (subquery: string) => TextureSelectionInputOne;
/**
 * Texture selection input could be one:
 * - texture
 * - sprite definition (and an atlas): atlas sprite texture
 * - string (with an atlas): string used as key to find sprite in the atlas, re-resolve
 * - hash object: use subquery as key, then re-resolve value
 * - array: re-resolve first item
 * - function: call function with subquery, then re-resolve
 */
export type TextureSelectionInput = TextureSelectionInputOne | TextureSelectionInputMap | TextureSelectionInputArray | TextureSelectionInputFactory;
/**
 * TextureSelection holds reference to one or many textures or something that
 * can be resolved to one or many textures. This is used to decouple resolving
 * references to textures from rendering them in various ways.
 */
export declare class TextureSelection {
	selection: TextureSelectionInput;
	atlas: Atlas;
	constructor(selection: TextureSelectionInput, atlas?: Atlas);
	one(subquery?: string): Texture;
	array(arr?: Texture[]): Texture[];
}
export declare const atlas: (def: AtlasDefinition | Atlas) => Promise<Atlas>;
/**
 * When query argument is string, this function parses the query; looks up registered atlases; and returns a texture selection object.
 *
 * When query argument is an object, the object is used to create a new selection.
 */
export declare const texture: (query: string | TextureSelectionInput) => TextureSelection;
export interface AtlasTextureDefinition {
	x: number;
	y: number;
	width: number;
	height: number;
	left?: number;
	top?: number;
	right?: number;
	bottom?: number;
}
export type AtlasTextureReferenceOne = AtlasTextureDefinition | string;
export type AtlasTextureReferenceMap = Record<string, AtlasTextureReferenceOne>;
export type AtlasTextureReferenceArray = AtlasTextureReferenceOne[];
export interface AtlasDefinition {
	name?: string;
	image?: {
		/** @deprecated */
		url: string;
		src: string;
		ratio?: number;
	};
	ppu?: number;
	textures?: Record<string, AtlasTextureDefinition | AtlasTextureReferenceMap | AtlasTextureReferenceArray>;
	map?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;
	/** @deprecated Use map */
	filter?: (texture: AtlasTextureDefinition) => AtlasTextureDefinition;
	/** @deprecated */
	trim?: number;
	/** @deprecated Use ppu */
	ratio?: number;
	/** @deprecated Use map */
	imagePath?: string;
	/** @deprecated Use map */
	imageRatio?: number;
}
export declare class Atlas extends Texture {
	constructor(def?: AtlasDefinition);
	load(): Promise<void>;
	select: (query?: string) => TextureSelection;
}
export type CanvasTextureDrawer = (this: CanvasTexture) => void;
export type CanvasTextureMemoizer = (this: CanvasTexture) => any;
/**
 * A texture with off-screen canvas.
 */
export declare class CanvasTexture extends Texture {
	constructor(type?: string, attributes?: any);
	/**
	 * Note: texture size is set to width and height, and canvas size is texture size multiply by pixelRatio.
	 */
	setSize(width: number, height: number, pixelRatio?: number): void;
	getContext(): any;
	setMemoizer(memoizer: CanvasTextureMemoizer): void;
	setDrawer(drawer: CanvasTextureDrawer): void;
}
/**
 * Create CanvasTexture (a texture with off-screen canvas).
 */
export declare function canvas(): CanvasTexture;
/** @hidden */
export interface Pinned {
	pin(pin: object): this;
	pin(key: string, value: any): this;
	pin(key: string): any;
	size(w: number, h: number): this;
	width(): number;
	width(w: number): this;
	height(): number;
	height(h: number): this;
	offset(a: Vec2Value): this;
	offset(a: number, b: number): this;
	rotate(a: number): this;
	skew(a: Vec2Value): this;
	skew(a: number, b: number): this;
	scale(a: Vec2Value): this;
	scale(a: number, b: number): this;
	alpha(a: number, ta?: number): this;
}
export declare class Pin {
	reset(): void;
	toString(): string;
	absoluteMatrix(): Matrix;
	relativeMatrix(): Matrix;
}
/**
 * Easing function formats are:
 * - [name]
 * - [name\]([params])
 * - [name]-[mode]
 * - [name]-[mode\]([params])
 *
 * Easing function names are 'linear', 'quad', 'cubic', 'quart', 'quint', 'sin' (or 'sine'), 'exp' (or 'expo'), 'circle' (or 'circ'), 'bounce', 'poly', 'elastic', 'back'.
 *
 * Easing modes are 'in', 'out', 'in-out', 'out-in'.
 *
 * For example, 'linear', 'cubic-in', and 'poly(2)'.
 */
export type EasingFunctionName = string;
export type EasingFunction = (p: number) => number;
export type TransitionOptions = {
	duration?: number;
	delay?: number;
	append?: boolean;
};
export type TransitionEndListener = (this: Node$1) => void;
export declare class Transition implements Pinned {
	constructor(owner: Node$1, options?: TransitionOptions);
	tween(opts?: TransitionOptions): Transition;
	tween(duration?: number, delay?: number): Transition;
	duration(duration: number): this;
	delay(delay: number): this;
	ease(easing: EasingFunctionName | EasingFunction): this;
	done(fn: TransitionEndListener): this;
	hide(): this;
	remove(): this;
	pin(key: string, value: any): this;
	pin(obj: object): this;
	pin(key: string): any;
	/**
	 * @deprecated Use .done(fn) instead.
	 */
	then(fn: TransitionEndListener): this;
	/**
	 * @deprecated this doesn't do anything anymore, call transition on the node instead.
	 */
	clear(forward: boolean): this;
	size(w: number, h: number): this;
	width(w: number): this;
	width(): number;
	height(h: number): this;
	height(): number;
	offset(value: Vec2Value): this;
	offset(x: number, y: number): this;
	rotate(a: number): this;
	skew(value: Vec2Value): this;
	skew(x: number, y: number): this;
	scale(value: Vec2Value): this;
	scale(x: number, y: number): this;
	alpha(a: number, ta?: number): this;
}
export interface NodeVisitor<D> {
	reverse?: boolean;
	visible?: boolean;
	start?: (node: Node$1, data?: D) => boolean | void;
	end?: (node: Node$1, data?: D) => boolean | void;
}
export type NodeTickListener<T> = (this: T, elapsed: number, now: number, last: number) => boolean | void;
export type NodeEventListener<T> = (this: T, ...args: any[]) => void;
/** @deprecated Use layout() */
export declare const create: () => Node$1;
/** @deprecated Use maximize() */
export declare const layer: () => string | Node$1;
/** @deprecated Use minimize() */
export declare const box: () => string | Node$1;
export declare const layout: () => Node$1;
export declare const row: (align: number) => string | Node$1;
export declare const column: (align: number) => string | Node$1;
export declare const minimize: () => string | Node$1;
export declare const maximize: () => string | Node$1;
declare class Node$1 implements Pinned {
	MAX_ELAPSE: number;
	constructor();
	matrix(relative?: boolean): Matrix;
	pin(key: string): any;
	pin(key: string, value: any): this;
	pin(obj: object): this;
	pin(): Pin;
	scaleTo(a: any, b: any, c: any): this;
	toString(): string;
	/** @deprecated Use label() */
	id(id: string): string | this;
	label(label: string): string | this;
	attr(name: string, value: any): this;
	attr(name: string): any;
	visible(visible: boolean): this;
	visible(): boolean;
	hide(): this;
	show(): this;
	parent(): Node$1;
	next(visible?: boolean): Node$1;
	prev(visible?: boolean): Node$1;
	first(visible?: boolean): Node$1;
	last(visible?: boolean): Node$1;
	visit<P>(visitor: NodeVisitor<P>, payload?: P): boolean | void;
	append(child: Node$1, more?: any): this;
	prepend(child: Node$1, more?: any): this;
	appendTo(parent: Node$1): this;
	prependTo(parent: Node$1): this;
	insertNext(sibling: Node$1, more?: Node$1): this;
	insertPrev(sibling: Node$1, more?: Node$1): this;
	insertAfter(prev: Node$1): this;
	insertBefore(next: Node$1): this;
	remove(child?: Node$1, more?: any): this;
	empty(): this;
	touch(): this;
	prerender(): void;
	render(context: CanvasRenderingContext2D): void;
	tick(callback: NodeTickListener<this>, before?: boolean): void;
	untick(callback: NodeTickListener<this>): void;
	timeout(callback: () => any, time: number): void;
	setTimeout(callback: () => any, time: number): (t: number) => boolean;
	clearTimeout(timer: NodeTickListener<this>): void;
	on(types: string, listener: NodeEventListener<this>): this;
	off(types: string, listener: NodeEventListener<this>): this;
	listeners(type: string): NodeEventListener<this>[];
	publish(name: string, args?: any): number;
	size(w: number, h: number): this;
	width(w: number): this;
	width(): number;
	height(h: number): this;
	height(): number;
	offset(value: Vec2Value): this;
	offset(x: number, y: number): this;
	rotate(a: number): this;
	skew(value: Vec2Value): this;
	skew(x: number, y: number): this;
	scale(value: Vec2Value): this;
	scale(x: number, y: number): this;
	alpha(a: number, ta?: number): this;
	tween(opts?: TransitionOptions): Transition;
	tween(duration?: number, delay?: number, append?: boolean): Transition;
	row(align: number): this;
	column(align: number): this;
	align(type: "row" | "column", align: number): this;
	/** @deprecated Use minimize() */
	box(): this;
	/** @deprecated Use minimize() */
	layer(): this;
	/**
	 * Set size to match largest child size.
	 */
	minimize(): this;
	/**
	 * Set size to match parent size.
	 */
	maximize(): this;
	/**
	 * Set cell spacing for layout.
	 */
	padding(pad: number): this;
	/**
	 * Set cell spacing for row and column layout.
	 */
	spacing(space: number): this;
}
export declare const POINTER_CLICK = "click";
export declare const POINTER_START = "touchstart mousedown";
export declare const POINTER_MOVE = "touchmove mousemove";
export declare const POINTER_END = "touchend mouseup";
export declare const POINTER_CANCEL = "touchcancel mousecancel";
export declare const pause: () => void;
export declare const resume: () => void;
export declare const mount: (configs?: RootConfig) => Root;
export type RootConfig = {
	canvas?: string | HTMLCanvasElement;
};
/**
 * Geometry of the rectangular that the application takes on the screen.
 */
export type Viewport = {
	width: number;
	height: number;
	ratio: number;
};
/**
 * Geometry of a rectangular portion of the game that is projected on the screen.
 */
export type Viewbox = {
	x?: number;
	y?: number;
	width: number;
	height: number;
	mode?: FitMode;
};
/**
 * - 'in-pad': similar to css object-fit: 'contain'
 * - 'in'
 * - 'out-crop': similar css object-fit: 'cover'
 * - 'out'
 */
export type FitMode = "in" | "out" | "out-crop" | "in-pad";
export declare class Root extends Node$1 {
	canvas: HTMLCanvasElement | null;
	dom: HTMLCanvasElement | null;
	context: CanvasRenderingContext2D | null;
	mounted: boolean;
	paused: boolean;
	sleep: boolean;
	constructor();
	mount: (configs?: RootConfig) => void;
	resume(): this;
	pause(): this;
	unmount(): this;
	background(color: string): this;
	/**
	 * Set/Get viewport.
	 * This is used along with viewbox to determine the scale and position of the viewbox within the viewport.
	 * Viewport is the size of the container, for example size of the canvas element.
	 * Viewbox is provided by the user, and is the ideal size of the content.
	 */
	viewport(): Viewport;
	viewport(width: number, height: number, ratio?: number): this;
	viewport(viewbox: Viewport): this;
	/**
	 * Set viewbox.
	 */
	viewbox(viewbox: Viewbox): this;
	viewbox(width?: number, height?: number, mode?: FitMode): this;
	camera(matrix: Matrix): this;
}
export declare const sprite: (frame?: TextureSelectionInput) => Sprite;
export declare class Sprite extends Node$1 {
	constructor();
	texture(frame: TextureSelectionInput): this;
	/** @deprecated */
	image(frame: TextureSelectionInput): this;
	tile(inner: boolean): this;
	stretch(inner: boolean): this;
	prerender(): void;
}
export declare const anim: (frames: string | TextureSelectionInputArray, fps?: number) => Anim;
export declare class Anim extends Node$1 {
	constructor();
	fps(fps?: number): number | this;
	/** @deprecated Use frames */
	setFrames(frames: string | TextureSelectionInputArray): this;
	frames(frames: string | TextureSelectionInputArray): this;
	length(): number;
	gotoFrame(frame: number, resize?: boolean): this;
	moveFrame(move: any): this;
	repeat(repeat: any, callback: any): this;
	play(frame?: number): this;
	stop(frame?: number): this;
}
export declare const string: (chars: string | Record<string, Texture> | ((char: string) => Texture)) => Str;
export declare class Str extends Node$1 {
	constructor();
	/** @deprecated Use frames */
	setFont(frames: string | Record<string, Texture> | ((char: string) => Texture)): this;
	frames(frames: string | Record<string, Texture> | ((char: string) => Texture)): this;
	/** @deprecated Use value */
	setValue(value: any): string | number | string[] | number[] | this;
	value(value: string | number | string[] | number[]): string | number | string[] | number[] | this;
}

declare namespace Stage {
	export { Anim, Atlas, AtlasDefinition, AtlasTextureDefinition, CanvasTexture, FitMode, Matrix, MatrixValue, Node$1 as Node, NodeEventListener, NodeTickListener, POINTER_CANCEL, POINTER_CLICK, POINTER_END, POINTER_MOVE, POINTER_START, Pin, Pinned, Root, Sprite, Str, Texture, TextureSelection, TextureSelectionInput, TextureSelectionInputArray, TextureSelectionInputFactory, TextureSelectionInputMap, TextureSelectionInputOne, TextureSource, Transition, TransitionEndListener, TransitionOptions, Vec2Value, Viewbox, Viewport, anim, atlas, box, canvas, column, create, layer, layout, math, maximize, minimize, mount, pause, resume, row, sprite, string, texture };
}

export {
	Node$1 as Node,
	Stage as default,
};

export {};
