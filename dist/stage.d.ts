export declare const math: any;
export interface MatrixValue {
	/** x-scale */
	a: number;
	b: number;
	c: number;
	/** y-scale */
	d: number;
	/** x-translate */
	e: number;
	/** y-translate */
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
	reset(): this;
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
/**
 * Textures are used to clip and resize image objects.
 */
export declare abstract class Texture {
	setSourceCoordinate(x: number, y: number): void;
	setSourceDimension(w: number, h: number): void;
	setDestinationCoordinate(x: number, y: number): void;
	setDestinationDimension(w: number, h: number): void;
	abstract getWidth(): number;
	abstract getHeight(): number;
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
export type TextureImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
export declare class ImageTexture extends Texture {
	constructor(source?: TextureImageSource, pixelRatio?: number);
	setSourceImage(image: TextureImageSource, pixelRatio?: number): void;
	getWidth(): number;
	getHeight(): number;
}
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
export type AtlasImageDefinition = string | {
	src: string;
	ratio?: number;
} | {
	url: string;
	ratio?: number;
};
export type AtlasTexturesDefinitionRecords = Record<string, AtlasTextureDefinition | AtlasTextureReferenceMap | AtlasTextureReferenceArray>;
export type AtlasTexturesDefinitionFunction = (key: string) => AtlasTextureDefinition | AtlasTextureReferenceMap | AtlasTextureReferenceArray;
export type AtlasTexturesDefinition = AtlasTexturesDefinitionRecords | AtlasTexturesDefinitionFunction;
export type AtlasTexturesMapFunction = (texture: AtlasTextureDefinition) => AtlasTextureDefinition;
export type AtlasTexturesFilterFunction = (texture: AtlasTextureDefinition) => AtlasTextureDefinition;
export interface AtlasDefinition {
	name?: string;
	image?: AtlasImageDefinition;
	ppu?: number;
	textures?: AtlasTexturesDefinitionRecords | AtlasTexturesDefinitionFunction;
	map?: AtlasTexturesMapFunction;
	/** @deprecated Use map */
	filter?: AtlasTexturesFilterFunction;
	/** @deprecated */
	trim?: number;
	/** @deprecated Use ppu */
	ratio?: number;
	/** @deprecated Use map */
	imagePath?: string;
	/** @deprecated Use map */
	imageRatio?: number;
}
export declare class Atlas extends ImageTexture {
	constructor(def?: AtlasDefinition);
	load(): Promise<void>;
	select: (query?: string) => TextureSelection;
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
export declare function atlas(def: AtlasDefinition | Atlas): Promise<Atlas>;
/**
 * When query argument is string, this function parses the query; looks up registered atlases; and returns a texture selection object.
 *
 * When query argument is an object, the object is used to create a new selection.
 */
export declare function texture(query: string | TextureSelectionInput): TextureSelection;
/**
 * @deprecated
 * - 'in-pad': same as 'contain'
 * - 'in': similar to 'contain' without centering
 * - 'out-crop': same as 'cover'
 * - 'out': similar to 'cover' without centering
 */
export type LegacyFitMode = "in" | "out" | "out-crop" | "in-pad";
/**
 * - 'contain': contain within the provided space, maintain aspect ratio
 * - 'cover': cover the provided space, maintain aspect ratio
 * - 'fill': fill provided space without maintaining aspect ratio
 */
export type FitMode = "contain" | "cover" | "fill" | LegacyFitMode;
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
	toString(): string;
	toMatrix(): Matrix;
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
export type TransitionEndListener = (this: Component) => void;
export declare class Transition implements Pinned {
	constructor(owner: Component, options?: TransitionOptions);
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
	 * @deprecated this doesn't do anything anymore, call transition on the component instead.
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
	scale(x: number, y?: number): this;
	alpha(a: number, ta?: number): this;
}
export interface LayoutObject {
}
export interface ComponentVisitor {
	reverse?: boolean;
	visible?: boolean;
	start?: (component: Component, data?: any) => boolean | void;
	end?: (component: Component, data?: any) => boolean | void;
}
export type ComponentTickListener = (this: Component, elapsed: number, now: number, last: number) => boolean | void;
export type ComponentEventListener<T> = (this: T, ...args: any[]) => void;
export declare class Component implements LayoutObject {
	private _visible;
	private _label;
	private _attrs;
	/** @hidden @deprecated */
	MAX_ELAPSE: number;
	toString(): string;
	/** @deprecated Use label() */
	id(id: string): this;
	label(label: string): this;
	label(): string;
	attr(key: string, value: any): this;
	attr(key: string): any;
	/**
	 * Updates the revision/timestamp of this component and its parents.
	 * This is used internally for component tree lifecycle management, such as updating the rendering.
	 */
	touch(): this;
	tick(callback: ComponentTickListener, before?: boolean): void;
	untick(callback: ComponentTickListener): void;
	timeout(callback: () => any, time: number): void;
	setTimeout(callback: () => any, time: number): (t: number) => boolean;
	clearTimeout(timer: ComponentTickListener): void;
	on(types: string, listener: ComponentEventListener<this>): this;
	off(types: string, listener: ComponentEventListener<this>): this;
	listeners(type: string): ComponentEventListener<Component>[];
	publish(name: string, args?: any): number;
	visit(visitor: ComponentVisitor, payload?: any): boolean | void;
	prerenderTree(): void;
	prerender(): void;
	renderTree(context: CanvasRenderingContext2D): void;
	render(context: CanvasRenderingContext2D): void;
	visible(visible: boolean): this;
	visible(): boolean;
	hide(): this;
	show(): this;
	parent(): Component;
	setParent(parent: Component): void;
	first(visible?: boolean): Component;
	setFirst(first: Component): void;
	last(visible?: boolean): Component;
	setLast(last: Component): void;
	next(visible?: boolean): Component;
	setNext(next: Component): void;
	prev(visible?: boolean): Component;
	setPrev(prev: Component): void;
	append(...child: Component[]): this;
	append(child: Component[]): this;
	prepend(...child: Component[]): this;
	prepend(child: Component[]): this;
	appendTo(parent: Component): this;
	prependTo(parent: Component): this;
	insertNext(sibling: Component, more?: Component): this;
	insertPrev(sibling: Component, more?: Component): this;
	insertAfter(prev: Component): this;
	insertBefore(next: Component): this;
	remove(child?: Component, more?: any): this;
	empty(): this;
	onChildAdded(child: Component): void;
	onChildRemoved(child: Component): void;
	/** @hidden used by parent for row/column, and parent minimize */
	getBoxWidth(): number;
	/** @hidden used by parent for row/column, and parent minimize */
	getBoxHeight(): number;
	/** @hidden used by child for maximize, and pin align */
	getWidth(): number;
	/** @hidden used by child for maximize, and pin align */
	getHeight(): number;
	/** @hidden used by parent for layout alignment */
	setOffsetX(value: number): void;
	/** @hidden used by parent for layout alignment */
	setOffsetY(value: number): void;
	/** @hidden used by parent for layout alignment */
	setAlignX(value: number): void;
	/** @hidden used by parent for layout alignment */
	setAlignY(value: number): void;
	matrix(relative?: boolean): Matrix;
	getTransform(combined?: boolean): Matrix;
	pin(key: string): any;
	pin(key: string, value: any): this;
	pin(obj: object): this;
	pin(): Pin;
	fit(width: number, height: number, mode?: FitMode): this;
	fit(fit: {
		width: number;
		height: number;
	}): this;
	/** @hidden @deprecated Use fit */
	scaleTo(a: any, b?: any, c?: any): this;
	size(w: number, h: number): this;
	width(w: number): this;
	width(): number;
	height(h: number): this;
	height(): number;
	offset(value: Vec2Value): this;
	offset(x: number, y: number): this;
	rotate(a: number): this;
	skew(value: Vec2Value): this;
	skew(x: number, y?: number): this;
	scale(value: Vec2Value): this;
	scale(x: number, y?: number): this;
	/** Set padding layout */
	padding(value: number): this;
	/** Get padding. */
	padding(): number;
	/** Set spacing for row, column, monotype */
	spacing(value: number): this;
	/** Get spacing */
	spacing(): number;
	alpha(a: number, ta?: number): this;
	tween(): Transition;
	tween(opts: TransitionOptions): Transition;
	tween(duration: number, delay?: number, append?: boolean): Transition;
	tween(duration: number): Transition;
	row(align: number): this;
	column(align: number): this;
	/** @deprecated Use minimize() */
	box(): this;
	/** @deprecated Use minimize() */
	layer(): this;
	/** Set size to match largest child size. */
	minimize(): this;
	/** Set size to match parent size. */
	maximize(): this;
}
/** @deprecated Use component() */
export declare function create(): Component;
export declare function component(): Component;
/** @deprecated Use maximize() */
export declare function layer(): Component;
/** @deprecated Use minimize() */
export declare function box(): Component;
export declare function row(align?: number): Component;
export declare function column(align?: number): Component;
export declare function minimize(): Component;
export declare function maximize(): Component;
export type SpriteTextureInput = TextureSelectionInput;
export declare function sprite(frame?: TextureSelectionInput): Sprite;
export declare class Sprite extends Component {
	constructor(frame?: SpriteTextureInput);
	texture(frame: SpriteTextureInput): this;
	/** @deprecated */
	image(frame: SpriteTextureInput): this;
	tile(inner?: boolean): this;
	stretch(inner?: boolean): this;
	prerender(): void;
	render(context: CanvasRenderingContext2D): void;
}
export type CanvasTextureDrawer = (this: CanvasTexture) => void;
export type CanvasTextureMemoizer = (this: CanvasTexture) => any;
/** @hidden @deprecated */
export type LegacyCanvasTextureDrawer = (this: CanvasTexture, context: CanvasRenderingContext2D) => void;
/** @hidden @deprecated */
export type LegacyCanvasSpriteMemoizer = () => any;
/** @hidden @deprecated */
export type LegacyCanvasSpriteDrawer = (ratio: number, texture: CanvasTexture, sprite: Sprite) => void;
/**
 * A texture with off-screen canvas.
 */
export declare class CanvasTexture extends ImageTexture {
	constructor();
	/**
	 * Note: provided width and height will be texture size, and canvas size is texture size multiply by pixelRatio.
	 */
	setSize(textureWidth: number, textureHeight: number, pixelRatio?: number): void;
	getContext(type?: string, attributes?: any): CanvasRenderingContext2D;
	/**
	 * @experimental
	 *
	 * This is the ratio of screen pixel to this canvas pixel.
	 */
	getOptimalPixelRatio(): number;
	setMemoizer(memoizer: CanvasTextureMemoizer): void;
	setDrawer(drawer: CanvasTextureDrawer): void;
	/** @hidden @deprecated */
	size(width: number, height: number, pixelRatio: number): this;
	/** @hidden @deprecated */
	context(type?: string, attributes?: any): CanvasRenderingContext2D;
	/** @hidden @deprecated */
	canvas(legacyTextureDrawer: LegacyCanvasTextureDrawer): this;
}
/**
 * Create CanvasTexture (a texture with off-screen canvas).
 */
export declare function canvas(): CanvasTexture;
/** @hidden @deprecated */
export declare function memoizeDraw(legacySpriteDrawer: LegacyCanvasSpriteDrawer, legacySpriteMemoizer?: LegacyCanvasSpriteMemoizer): Sprite;
export declare class PipeTexture extends Texture {
	constructor(source: Texture);
	setSourceTexture(texture: Texture): void;
	getWidth(): number;
	getHeight(): number;
}
export type ResizableTextureMode = "stretch" | "tile";
export declare class ResizableTexture extends Texture {
	constructor(source: Texture, mode: ResizableTextureMode);
	getWidth(): number;
	getHeight(): number;
	drawWithNormalizedArgs(context: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}
export declare const POINTER_CLICK = "click";
export declare const POINTER_START = "touchstart mousedown";
export declare const POINTER_MOVE = "touchmove mousemove";
export declare const POINTER_END = "touchend mouseup";
export declare const POINTER_CANCEL = "touchcancel mousecancel";
export declare function pause(): void;
export declare function resume(): void;
export declare function mount(configs?: RootConfig): Root;
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
export declare class Root extends Component {
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
	 *
	 * Viewport is the size of the container, for example size of the canvas element.
	 *
	 * Viewbox is provided by the user, and defines a rectangle that is projected (scaled and positioned) into the viewport.
	 */
	viewport(): Viewport;
	viewport(width: number, height: number, ratio?: number): this;
	viewport(viewbox: Viewport): this;
	/**
	 * Set viewbox.
	 *
	 * The provided dimension is automatically scaled to fit in the available container viewport.
	 */
	viewbox(viewbox: Viewbox): this;
	viewbox(width?: number, height?: number, mode?: FitMode): this;
	camera(matrix: Matrix): this;
}
export type AnimTextureInput = string | TextureSelectionInputArray;
export declare function anim(frames?: AnimTextureInput, fps?: number): Anim;
export declare class Anim extends Component {
	constructor(frames?: AnimTextureInput, fps?: number);
	private _lastFrameTime;
	private _animLoop;
	fps(fps: number): this;
	fps(): number;
	/** @deprecated Use frames */
	setFrames(frames: string | TextureSelectionInputArray): this;
	frames(frames: string | TextureSelectionInputArray): this;
	length(): number;
	gotoFrame(frame: number, resize?: boolean): this;
	moveFrame(move: number): this;
	repeat(repeat: number, callback: () => any): this;
	play(startFromFrame?: number): this;
	stop(stopAtFrame?: number): this;
	render(context: CanvasRenderingContext2D): void;
}
export declare function monotype(font: MonotypeTextureInput): Monotype;
export type MonotypeTextureInput = string | Record<string, Texture> | ((char: string) => Texture);
export type MonotypeValue = string | number | string[] | number[];
export declare class Monotype extends Component {
	constructor(font?: MonotypeTextureInput);
	/** @deprecated Use frames */
	setFont(frames: MonotypeTextureInput): this;
	frames(frames: MonotypeTextureInput): this;
	/** @deprecated Use value */
	setValue(value: MonotypeValue): this;
	value(): MonotypeValue;
	value(value: MonotypeValue): this;
	render(context: CanvasRenderingContext2D): void;
}

declare namespace Stage {
	export { Anim, Atlas, AtlasDefinition, AtlasImageDefinition, AtlasTextureDefinition, AtlasTexturesDefinition, AtlasTexturesDefinitionFunction, AtlasTexturesDefinitionRecords, AtlasTexturesFilterFunction, AtlasTexturesMapFunction, CanvasTexture, Component, ComponentEventListener, ComponentTickListener, ComponentVisitor, FitMode, ImageTexture, LegacyFitMode, Matrix, MatrixValue, Monotype, POINTER_CANCEL, POINTER_CLICK, POINTER_END, POINTER_MOVE, POINTER_START, Pin, Pinned, PipeTexture, ResizableTexture, ResizableTextureMode, Root, Sprite, Texture, TextureSelection, TextureSelectionInput, TextureSelectionInputArray, TextureSelectionInputFactory, TextureSelectionInputMap, TextureSelectionInputOne, Transition, TransitionEndListener, TransitionOptions, Vec2Value, Viewbox, Viewport, anim, atlas, box, canvas, column, component, create, layer, math, maximize, memoizeDraw, minimize, monotype, mount, pause, resume, row, sprite, texture };
}

export {
	Stage as default,
};

export {};
