import { ref, computed, ComputedRef, unref } from "vue"
import { screenMap, sizeEnum, screenEnum } from '@/enums/breakpointEnum';

let globalScreenRef: ComputedRef<sizeEnum | undefined>
let globalWidthRef: ComputedRef<number>
let globalRealWidthRef: ComputedRef<number>

export interface CreateCallbackParams {
    screen: ComputedRef<sizeEnum | undefined>
    width: ComputedRef<number>
    realWidth:ComputedRef<number>
    screenEnum: typeof screenEnum
    screenMap: Map<sizeEnum, number>
    sizeEnum: typeof sizeEnum
}

export function useBreakpoint(){
    return {
        screenRef: computed(() => unref(globalScreenRef)),
        widthRef: globalWidthRef,
        screenEnum,
        realWidthRef: globalRealWidthRef
    }
}

export function createBreakpointListen(fn?: (opt: CreateCallbackParams) => void) {

}