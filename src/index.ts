export interface Blueprint<Props = unknown, Result = unknown, Self = unknown> {
    (props: Props): Result

    addon<B>(addon: Addon<B>): B & Self & Blueprint<Props, Result, Self & B>

    implement(handle: (props: Props) => Result): Self & Blueprint<Props, Result, Self>
}

export interface Addon<AddonCore> {
    core: AddonCore
}

export function notImplemented(returns: boolean = false) {
    const error = new Error('Not Implemented')
    if (returns === true)
        return error
    throw error
}

export default function blueprint<Props, Result>(init: (props: Props) => Result = notImplemented as any) {

    return Object.assign(init, {
        addon(addon) {
            return { ...this, ...addon }
        },
        implement(handle) {
            return blueprint(handle).addon(this)
        },
    }) as Blueprint<Props, Result>
}

namespace Example {

    type AB = {a: number, b: number}
    
    type SumFun = ({a, b}: AB) => number
    
    const sum : SumFun = ({a, b}: AB) => {
        return a + b
    }

    const test = {
        early: blueprint(sum),
        late: blueprint<AB, number>().implement(sum),
    }

    const isNumIfNoRedUnderline = test.early({a: 1, b: 1}).toFixed() && test.late({a: 1, b: 1}).toFixed()
}

