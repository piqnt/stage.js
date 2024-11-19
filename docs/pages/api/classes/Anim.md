# Class: Anim

## Extends

- [`Node`](Node)

## Constructors

### new Anim()

> **new Anim**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Overrides

[`Node`](Node).[`constructor`](Node#constructors)

## Properties

### MAX\_ELAPSE

> **MAX\_ELAPSE**: `number` = `Infinity`

#### Inherited from

[`Node`](Node).[`MAX_ELAPSE`](Node#max_elapse)

## Methods

### align()

> **align**(`type`, `align`): [`Anim`](Anim)

#### Parameters

• **type**: `"row"` \| `"column"`

• **align**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`align`](Node#align)

***

### alpha()

> **alpha**(`a`, `ta`?): [`Anim`](Anim)

#### Parameters

• **a**: `number`

• **ta?**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`alpha`](Node#alpha)

***

### append()

#### append(child)

> **append**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`append`](Node#append)

#### append(child)

> **append**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`append`](Node#append)

***

### appendTo()

> **appendTo**(`parent`): [`Anim`](Anim)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`appendTo`](Node#appendto)

***

### attr()

#### attr(name, value)

> **attr**(`name`, `value`): `this`

##### Parameters

• **name**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`attr`](Node#attr)

#### attr(name)

> **attr**(`name`): `any`

##### Parameters

• **name**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](Node).[`attr`](Node#attr)

***

### ~~box()~~

> **box**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Deprecated

Use minimize()

#### Inherited from

[`Node`](Node).[`box`](Node#box)

***

### clearTimeout()

> **clearTimeout**(`timer`): `void`

#### Parameters

• **timer**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Anim`](Anim)\>

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`clearTimeout`](Node#cleartimeout)

***

### column()

> **column**(`align`): [`Anim`](Anim)

#### Parameters

• **align**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`column`](Node#column)

***

### empty()

> **empty**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`empty`](Node#empty)

***

### first()

> **first**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`first`](Node#first)

***

### fit()

#### fit(width, height, mode)

> **fit**(`width`, `height`, `mode`?): `this`

##### Parameters

• **width**: `number`

• **height**: `number`

• **mode?**: [`FitMode`](../type-aliases/FitMode)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`fit`](Node#fit)

#### fit(fit)

> **fit**(`fit`): `this`

##### Parameters

• **fit**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`fit`](Node#fit)

***

### fps()

> **fps**(`fps`?): `number` \| [`Anim`](Anim)

#### Parameters

• **fps?**: `number`

#### Returns

`number` \| [`Anim`](Anim)

***

### frames()

> **frames**(`frames`): [`Anim`](Anim)

#### Parameters

• **frames**: `string` \| [`TextureSelectionInputArray`](../type-aliases/TextureSelectionInputArray)

#### Returns

[`Anim`](Anim)

***

### gotoFrame()

> **gotoFrame**(`frame`, `resize`): [`Anim`](Anim)

#### Parameters

• **frame**: `number`

• **resize**: `boolean` = `false`

#### Returns

[`Anim`](Anim)

***

### height()

#### height(h)

> **height**(`h`): `this`

##### Parameters

• **h**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`height`](Node#height)

#### height()

> **height**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](Node).[`height`](Node#height)

***

### hide()

> **hide**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`hide`](Node#hide)

***

### ~~id()~~

> **id**(`id`): `string` \| [`Anim`](Anim)

#### Parameters

• **id**: `string`

#### Returns

`string` \| [`Anim`](Anim)

#### Deprecated

Use label()

#### Inherited from

[`Node`](Node).[`id`](Node#id)

***

### insertAfter()

> **insertAfter**(`prev`): [`Anim`](Anim)

#### Parameters

• **prev**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`insertAfter`](Node#insertafter)

***

### insertBefore()

> **insertBefore**(`next`): [`Anim`](Anim)

#### Parameters

• **next**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`insertBefore`](Node#insertbefore)

***

### insertNext()

> **insertNext**(`sibling`, `more`?): [`Anim`](Anim)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`insertNext`](Node#insertnext)

***

### insertPrev()

> **insertPrev**(`sibling`, `more`?): [`Anim`](Anim)

#### Parameters

• **sibling**: [`Node`](Node)

• **more?**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`insertPrev`](Node#insertprev)

***

### label()

> **label**(`label`): `string` \| [`Anim`](Anim)

#### Parameters

• **label**: `string`

#### Returns

`string` \| [`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`label`](Node#label)

***

### last()

> **last**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`last`](Node#last)

***

### ~~layer()~~

> **layer**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Deprecated

Use minimize()

#### Inherited from

[`Node`](Node).[`layer`](Node#layer)

***

### length()

> **length**(): `number`

#### Returns

`number`

***

### listeners()

> **listeners**(`type`): [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Anim`](Anim)\>[]

#### Parameters

• **type**: `string`

#### Returns

[`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Anim`](Anim)\>[]

#### Inherited from

[`Node`](Node).[`listeners`](Node#listeners)

***

### matrix()

> **matrix**(`relative`): [`Matrix`](Matrix)

#### Parameters

• **relative**: `boolean` = `false`

#### Returns

[`Matrix`](Matrix)

#### Inherited from

[`Node`](Node).[`matrix`](Node#matrix)

***

### maximize()

> **maximize**(): [`Anim`](Anim)

Set size to match parent size.

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`maximize`](Node#maximize)

***

### minimize()

> **minimize**(): [`Anim`](Anim)

Set size to match largest child size.

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`minimize`](Node#minimize)

***

### moveFrame()

> **moveFrame**(`move`): [`Anim`](Anim)

#### Parameters

• **move**: `any`

#### Returns

[`Anim`](Anim)

***

### next()

> **next**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`next`](Node#next)

***

### off()

> **off**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Anim`](Anim)\>

#### Returns

`this`

#### Inherited from

[`Node`](Node).[`off`](Node#off)

***

### offset()

#### offset(value)

> **offset**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`offset`](Node#offset)

#### offset(x, y)

> **offset**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`offset`](Node#offset)

***

### on()

> **on**(`types`, `listener`): `this`

#### Parameters

• **types**: `string`

• **listener**: [`NodeEventListener`](../type-aliases/NodeEventListener)\<[`Anim`](Anim)\>

#### Returns

`this`

#### Inherited from

[`Node`](Node).[`on`](Node#on)

***

### padding()

> **padding**(`pad`): [`Anim`](Anim)

Set cell spacing for layout.

#### Parameters

• **pad**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`padding`](Node#padding)

***

### parent()

> **parent**(): [`Node`](Node)

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`parent`](Node#parent)

***

### pin()

#### pin(key)

> **pin**(`key`): `any`

##### Parameters

• **key**: `string`

##### Returns

`any`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin(key, value)

> **pin**(`key`, `value`): `this`

##### Parameters

• **key**: `string`

• **value**: `any`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin(obj)

> **pin**(`obj`): `this`

##### Parameters

• **obj**: `object`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

#### pin()

> **pin**(): [`Pin`](Pin)

##### Returns

[`Pin`](Pin)

##### Inherited from

[`Node`](Node).[`pin`](Node#pin)

***

### play()

> **play**(`frame`?): [`Anim`](Anim)

#### Parameters

• **frame?**: `number`

#### Returns

[`Anim`](Anim)

***

### prepend()

#### prepend(child)

> **prepend**(...`child`): `this`

##### Parameters

• ...**child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`prepend`](Node#prepend)

#### prepend(child)

> **prepend**(`child`): `this`

##### Parameters

• **child**: [`Node`](Node)[]

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`prepend`](Node#prepend)

***

### prependTo()

> **prependTo**(`parent`): [`Anim`](Anim)

#### Parameters

• **parent**: [`Node`](Node)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`prependTo`](Node#prependto)

***

### prerender()

> **prerender**(): `void`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`prerender`](Node#prerender)

***

### prev()

> **prev**(`visible`?): [`Node`](Node)

#### Parameters

• **visible?**: `boolean`

#### Returns

[`Node`](Node)

#### Inherited from

[`Node`](Node).[`prev`](Node#prev)

***

### publish()

> **publish**(`name`, `args`?): `number`

#### Parameters

• **name**: `string`

• **args?**: `any`

#### Returns

`number`

#### Inherited from

[`Node`](Node).[`publish`](Node#publish)

***

### remove()

> **remove**(`child`?, `more`?): [`Anim`](Anim)

#### Parameters

• **child?**: [`Node`](Node)

• **more?**: `any`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`remove`](Node#remove)

***

### render()

> **render**(`context`): `void`

#### Parameters

• **context**: `CanvasRenderingContext2D`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`render`](Node#render)

***

### repeat()

> **repeat**(`repeat`, `callback`): [`Anim`](Anim)

#### Parameters

• **repeat**: `any`

• **callback**: `any`

#### Returns

[`Anim`](Anim)

***

### rotate()

> **rotate**(`a`): [`Anim`](Anim)

#### Parameters

• **a**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`rotate`](Node#rotate)

***

### row()

> **row**(`align`): [`Anim`](Anim)

#### Parameters

• **align**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`row`](Node#row)

***

### scale()

#### scale(value)

> **scale**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`scale`](Node#scale)

#### scale(x, y)

> **scale**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`scale`](Node#scale)

***

### ~~setFrames()~~

> **setFrames**(`frames`): [`Anim`](Anim)

#### Parameters

• **frames**: `string` \| [`TextureSelectionInputArray`](../type-aliases/TextureSelectionInputArray)

#### Returns

[`Anim`](Anim)

#### Deprecated

Use frames

***

### setTimeout()

> **setTimeout**(`callback`, `time`): (`t`) => `boolean`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`Function`

##### Parameters

• **t**: `number`

##### Returns

`boolean`

#### Inherited from

[`Node`](Node).[`setTimeout`](Node#settimeout)

***

### show()

> **show**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`show`](Node#show)

***

### size()

> **size**(`w`, `h`): [`Anim`](Anim)

#### Parameters

• **w**: `number`

• **h**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`size`](Node#size)

***

### skew()

#### skew(value)

> **skew**(`value`): `this`

##### Parameters

• **value**: [`Vec2Value`](../interfaces/Vec2Value)

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`skew`](Node#skew)

#### skew(x, y)

> **skew**(`x`, `y`): `this`

##### Parameters

• **x**: `number`

• **y**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`skew`](Node#skew)

***

### spacing()

> **spacing**(`space`): [`Anim`](Anim)

Set cell spacing for row and column layout.

#### Parameters

• **space**: `number`

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`spacing`](Node#spacing)

***

### stop()

> **stop**(`frame`?): [`Anim`](Anim)

#### Parameters

• **frame?**: `number`

#### Returns

[`Anim`](Anim)

***

### tick()

> **tick**(`callback`, `before`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Anim`](Anim)\>

• **before**: `boolean` = `false`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`tick`](Node#tick)

***

### timeout()

> **timeout**(`callback`, `time`): `void`

#### Parameters

• **callback**

• **time**: `number`

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`timeout`](Node#timeout)

***

### toString()

> **toString**(): `string`

Returns a string representation of an object.

#### Returns

`string`

#### Inherited from

[`Node`](Node).[`toString`](Node#tostring)

***

### touch()

> **touch**(): [`Anim`](Anim)

#### Returns

[`Anim`](Anim)

#### Inherited from

[`Node`](Node).[`touch`](Node#touch)

***

### tween()

#### tween(opts)

> **tween**(`opts`?): [`Transition`](Transition)

##### Parameters

• **opts?**: [`TransitionOptions`](../type-aliases/TransitionOptions)

##### Returns

[`Transition`](Transition)

##### Inherited from

[`Node`](Node).[`tween`](Node#tween)

#### tween(duration, delay, append)

> **tween**(`duration`?, `delay`?, `append`?): [`Transition`](Transition)

##### Parameters

• **duration?**: `number`

• **delay?**: `number`

• **append?**: `boolean`

##### Returns

[`Transition`](Transition)

##### Inherited from

[`Node`](Node).[`tween`](Node#tween)

***

### untick()

> **untick**(`callback`): `void`

#### Parameters

• **callback**: [`NodeTickListener`](../type-aliases/NodeTickListener)\<[`Anim`](Anim)\>

#### Returns

`void`

#### Inherited from

[`Node`](Node).[`untick`](Node#untick)

***

### visible()

#### visible(visible)

> **visible**(`visible`): `this`

##### Parameters

• **visible**: `boolean`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`visible`](Node#visible)

#### visible()

> **visible**(): `boolean`

##### Returns

`boolean`

##### Inherited from

[`Node`](Node).[`visible`](Node#visible)

***

### visit()

> **visit**\<`P`\>(`visitor`, `payload`?): `boolean` \| `void`

#### Type Parameters

• **P**

#### Parameters

• **visitor**: `NodeVisitor`\<`P`\>

• **payload?**: `P`

#### Returns

`boolean` \| `void`

#### Inherited from

[`Node`](Node).[`visit`](Node#visit)

***

### width()

#### width(w)

> **width**(`w`): `this`

##### Parameters

• **w**: `number`

##### Returns

`this`

##### Inherited from

[`Node`](Node).[`width`](Node#width)

#### width()

> **width**(): `number`

##### Returns

`number`

##### Inherited from

[`Node`](Node).[`width`](Node#width)
