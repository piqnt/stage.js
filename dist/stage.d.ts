// Generated by dts-bundle-generator v9.5.1

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
/**
 * Textures are used to clip and resize image objects.
 */
export declare abstract class Texture {
	/** @hidden */ sx: number;
	/** @hidden */ sy: number;
	/** @hidden */ sw: number;
	/** @hidden */ sh: number;
	/** @hidden */ dx: number;
	/** @hidden */ dy: number;
	/** @hidden */ dw: number;
	/** @hidden */ dh: number;
	setSourceCoordinate(x: number, y: number): void;
	setSourceDimension(w: number, h: number): void;
	setDestinationCoordinate(x: number, y: number): void;
	setDestinationDimension(w: number, h: number): void;
	abstract getWidth(): number;
	abstract getHeight(): number;
	/**
	 * Defer draw spec to texture config. This is used when a sprite draws its textures.
	 */
	draw(context: CanvasRenderingContext2D): void;
	/**
	 * This is probably unused.
	 * Note: dx, dy are added to this.dx, this.dy.
	 */
	draw(context: CanvasRenderingContext2D, dx: number, dy: number, dw: number, dh: number): void;
	/**
	 * This is used when a piped texture passes drawing to it backend.
	 * Note: sx, sy, dx, dy are added to this.sx, this.sy, this.dx, this.dy.
	 */
	draw(context: CanvasRenderingContext2D, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}
export type TextureImageSource = HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap | OffscreenCanvas;
export declare class ImageTexture extends Texture {
	constructor(source?: TextureImageSource, pixelRatio?: number);
	setSourceImage(image: TextureImageSource, pixelRatio?: number): void;
	/**
	 * Add padding to the image texture. Padding can be negative.
	 */
	setPadding(padding: number): void;
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
export type MonotypeAtlasTextureDefinition = Record<string, AtlasTextureDefinition | Texture | string>;
export type AnimAtlasTextureDefinition = (AtlasTextureDefinition | Texture | string)[];
export interface AtlasDefinition {
	name?: string;
	image?: {
		src: string;
		ratio?: number;
	} | {
		/** @deprecated Use src instead of url */
		url: string;
		ratio?: number;
	};
	ppu?: number;
	textures?: Record<string, AtlasTextureDefinition | Texture | MonotypeAtlasTextureDefinition | AnimAtlasTextureDefinition>;
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
 *  @hidden @deprecated
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
	 *  @hidden @deprecated Use .done(fn) instead.
	 */
	then(fn: TransitionEndListener): this;
	/**
	 *  @hidden @deprecated this doesn't do anything anymore, call transition on the component instead.
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
	scale(s: number): this;
	alpha(a: number, ta?: number): this;
}
export interface ComponentVisitor<D> {
	reverse?: boolean;
	visible?: boolean;
	start?: (component: Component, data?: D) => boolean | void;
	end?: (component: Component, data?: D) => boolean | void;
}
export type ComponentTickListener<T> = (this: T, elapsed: number, now: number, last: number) => boolean | void;
export type ComponentEventListener<T> = (this: T, ...args: any[]) => void;
/** @hidden @deprecated Use component() */
export declare function create(): Component;
/** @hidden @deprecated Use maximize() */
export declare function layer(): Component;
/** @hidden @deprecated Use minimize() */
export declare function box(): Component;
/** @hidden @deprecated */
export declare function layout(): Component;
export declare function component(): Component;
export declare function row(align: number): Component;
export declare function column(align: number): Component;
export declare function minimize(): Component;
export declare function maximize(): Component;
export declare class Component implements Pinned {
	MAX_ELAPSE: number;
	constructor();
	matrix(relative?: boolean): Matrix;
	/** @hidden @deprecated */
	getPixelRatio(): number;
	/** @hidden This is not accurate before first tick */
	getDevicePixelRatio(): number;
	/** @hidden This is not accurate before first tick */
	getLogicalPixelRatio(): number;
	pin(key: string): any;
	pin(key: string, value: any): this;
	pin(obj: object): this;
	pin(): Pin;
	fit(width: number, height: number, mode?: FitMode): this;
	fit(fit: object): this;
	/** @hidden @deprecated Use fit */
	scaleTo(a: any, b?: any, c?: any): this;
	toString(): string;
	/** @hidden @deprecated Use label() */
	id(): string;
	/** @hidden @deprecated Use label() */
	id(label: string): this;
	label(): string;
	label(label: string): this;
	attr(name: string, value: any): this;
	attr(name: string): any;
	visible(visible: boolean): this;
	visible(): boolean;
	hide(): this;
	show(): this;
	parent(): Component;
	next(visible?: boolean): Component;
	prev(visible?: boolean): Component;
	first(visible?: boolean): Component;
	last(visible?: boolean): Component;
	visit<P>(visitor: ComponentVisitor<P>, payload?: P): boolean | void;
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
	touch(): this;
	/** @hidden */
	prerender(): void;
	/** @hidden */
	prerenderTexture(): void;
	/** @hidden */
	private renderedBefore;
	/** @hidden */
	render(context: CanvasRenderingContext2D): void;
	/** @hidden */
	renderTexture(context: CanvasRenderingContext2D): void;
	tick(callback: ComponentTickListener<this>, before?: boolean): void;
	untick(callback: ComponentTickListener<this>): void;
	timeout(callback: () => any, time: number): void;
	setTimeout(callback: () => any, time: number): (t: number) => boolean;
	clearTimeout(timer: ComponentTickListener<this>): void;
	on(types: string, listener: ComponentEventListener<this>): this;
	off(types: string, listener: ComponentEventListener<this>): this;
	listeners(type: string): ComponentEventListener<Component>[];
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
	scale(s: number): this;
	alpha(a: number, ta?: number): this;
	tween(opts?: TransitionOptions): Transition;
	tween(duration?: number, delay?: number, append?: boolean): Transition;
	row(align: number): this;
	column(align: number): this;
	align(type: "row" | "column", align: number): this;
	/** @hidden @deprecated Use minimize() */
	box(): this;
	/** @hidden @deprecated Use minimize() */
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
export declare function sprite(frame?: TextureSelectionInput): Sprite;
export declare class Sprite extends Component {
	constructor();
	texture(frame: TextureSelectionInput): this;
	/** @deprecated */
	image(frame: TextureSelectionInput): this;
	tile(inner?: boolean): this;
	stretch(inner?: boolean): this;
	/** @hidden */
	prerenderTexture(): void;
	/** @hidden */
	renderTexture(context: CanvasRenderingContext2D): void;
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
	 * Set texture size to given width and height, and set canvas size to texture size multiply by pixelRatio.
	 */
	setSize(destWidth: number, destHeight: number, pixelRatio?: number): void;
	getContext(type?: string, attributes?: any): CanvasRenderingContext2D;
	/**
	 * @hidden @experimental
	 *
	 * This is the ratio of screen pixel to this canvas pixel.
	 */
	getDevicePixelRatio(): number;
	/** @hidden @deprecated */
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
export declare const POINTER_DOWN = "touchstart mousedown";
export declare const POINTER_MOVE = "touchmove mousemove";
export declare const POINTER_UP = "touchend mouseup";
export declare const POINTER_CANCEL = "touchcancel mousecancel";
/** @hidden @deprecated */
export declare const POINTER_START = "touchstart mousedown";
/** @hidden @deprecated */
export declare const POINTER_END = "touchend mouseup";
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
	/** @hidden */
	debugDrawAxis: number;
	private renderDebug;
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
	/** @hidden */
	flipX(x: boolean): this;
	/** @hidden */
	flipY(y: boolean): this;
}
export declare function anim(frames: string | TextureSelectionInputArray, fps?: number): Anim;
export declare class Anim extends Component {
	constructor();
	/** @hidden */
	renderTexture(context: CanvasRenderingContext2D): void;
	fps(fps?: number): number | this;
	/** @deprecated Use frames */
	setFrames(frames: string | TextureSelectionInputArray): this;
	frames(frames: string | TextureSelectionInputArray): this;
	length(): number;
	gotoFrame(frame: number, resize?: boolean): this;
	moveFrame(move: number): this;
	repeat(repeat: number, callback?: () => void): this;
	play(frame?: number): this;
	stop(frame?: number): this;
}
export declare function monotype(chars: string | Record<string, Texture> | ((char: string) => Texture)): Monotype;
export declare class Monotype extends Component {
	constructor();
	/** @hidden */
	renderTexture(context: CanvasRenderingContext2D): void;
	/** @deprecated Use frames */
	setFont(frames: string | Record<string, Texture> | ((char: string) => Texture)): this;
	frames(frames: string | Record<string, Texture> | ((char: string) => Texture)): this;
	/** @deprecated Use value */
	setValue(value: string | number | string[] | number[]): this;
	value(value: string | number | string[] | number[]): this;
}

export {
	Component as Node,
	Monotype as Str,
	Sprite as Image,
	monotype as string,
	sprite as image,
};

export {};
