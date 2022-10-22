import {Mutex} from "async-mutex";
import apply_animation from "./apply_animation";
import load_svg from "./load_svg";


export class Animator {
    // The target element id
    private readonly target_id: string;
    // The start svgs of the animations
    private readonly svgs: string[];
    // The diffs to apply
    private readonly diffs: any[][];
    // The current animation index
    private anim_index: number;
    // Ensure only one animation is running
    private run_mutex: Mutex;
    // ID of the last started animation, so that and
    // animation can stop itself, if it is not the last started
    // anymore
    private last_anim_id = 0;

    constructor(target_id: string, svgs: string[], diffs: any[][]) {
        this.target_id = target_id;
        this.svgs = svgs;
        this.diffs = diffs;
        this.anim_index = 0;
        this.run_mutex = new Mutex();
    }

    async rewind() {
        await this.run_mutex.runExclusive(async () => {
            this.anim_index = 0;
            this.last_anim_id = (this.last_anim_id + 1) % 256;
            await load_svg(this.target_id, this.svgs[0]);
            })
    }

    // Do the animation, no mutex
    private async do_animate(index: number): Promise<boolean> {
        if (index >= this.diffs.length) {
            return false;
        }
        // Load the base svg
        await load_svg(this.target_id, this.svgs[index]);
        // Do the animation
        await apply_animation(this.diffs[index]);
        return true;
    }

    async run_next(): Promise<boolean> {
        let result = false;
        await this.run_mutex.runExclusive(async () => {
            result = await this.do_animate(this.anim_index);
            this.last_anim_id = (this.last_anim_id + 1) % 256;
            this.anim_index = this.anim_index + 1;
        });
        return result;
    }

    async run_all() {
        for (let index = 0; index < this.diffs.length; ++index) {
            let anim_id = -1;
            await this.run_mutex.runExclusive(async () => {
                await this.do_animate(index);
                this.anim_index = index;
                this.last_anim_id = (this.last_anim_id + 1) % 256;
                anim_id = this.last_anim_id;
            });
            if (this.run_mutex.isLocked() && this.last_anim_id != anim_id) {
                return;
            }
        }
    }

    async repeat_all() {
        do {
            for (let index = 0; index < this.diffs.length; ++index) {
                let anim_id = -1;
                await this.run_mutex.runExclusive(async () => {
                    await this.do_animate(index);
                    this.anim_index = index;
                    this.last_anim_id = (this.last_anim_id + 1) % 256;
                    anim_id = this.last_anim_id;
                });
                if (this.run_mutex.isLocked() && this.last_anim_id != anim_id) {
                    return;
                }
            }
        } while(!this.run_mutex.isLocked());
    }

}





