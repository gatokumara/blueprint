export interface Blueprint<Props = unknown, Result = unknown, Self = unknown> {

    addon<B>(addon: Addon<B>): B & Self & Blueprint<Props, Result, Self & B>

    reinit(handle: (props: Props) => Result): Self & Blueprint<Props, Result, Self>

    call(props: Props) : Result

    mod<NewProps = Props, NewResult = Result>(
        mod: (handle: (props: Props) => Result) => (props: NewProps) => NewResult
    ) : Self & Blueprint<Props, Result, Self>
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

    let handle = init as any

    const core : Blueprint<Props, Result> = {
        call(props) {
            return handle(props) as Result
        },
        addon<A extends Addon<unknown>>(addon: A) {
            return { ...this, ...addon.core as any }
        },
        reinit(handle: (props: Props) => Result) {
            return blueprint(handle)
        },
        mod(mod) {
            handle = mod(handle)
            return this
        }
    }

    return core
}

namespace Example {

    type AB = {a: number, b: number}
    
    type SumFun = ({a, b}: AB) => number
    
    const sum : SumFun = ({a, b}: AB) => {
        return a + b
    }

    const test = {
        early: blueprint(sum),
        late: blueprint<AB, number>().reinit(sum),
    }

    const isNumIfNoRedUnderline = test.early.call({a: 1, b: 1}).toFixed() && test.late.call({a: 1, b: 1}).toFixed()
}

