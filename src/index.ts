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
            await load_svg(this.target_id, this.svgs[0]);
            })
    }

    async run_by_index(index: number): Promise<boolean> {
        let result = false;
        await this.run_mutex.runExclusive(async () => {
            if (index >= this.diffs.length) {
                result = false; // do nothing
                return;
            }
            // Load the base svg
            await load_svg(this.target_id, this.svgs[index]);
            // Do the animation
            await apply_animation(this.diffs[index]);
            // Update index
            this.anim_index = index + 1;
            result = true;
        });
        return result;
    }

    async run_next(): Promise<boolean> {
        return await this.run_by_index(this.anim_index);
    }

    async run_all() {
        for (let index = 0; index < this.diffs.length; ++index) {
            await this.run_by_index(index);
            if (this.run_mutex.isLocked()) {
                return;
            }
        }
    }

    async repeat_all() {
        do {
            await this.run_all();
        } while(!this.run_mutex.isLocked());
    }

}





