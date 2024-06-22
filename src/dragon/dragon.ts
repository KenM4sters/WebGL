import { PerspectiveCamera } from "./camera";
import { Graphics } from "./graphics/graphics";
import { Scene } from "./scene";


export class Dragon 
{
    constructor() 
    {
    }

    public SetAnimationLoop(callback: (elapsedTime: number, timeStep: number) => void): void 
    {
        this.scriptLoop = callback;
        this.animationFrameId = requestAnimationFrame((elapsedTime) => this.AnimationLoop(elapsedTime));
    }

    private AnimationLoop(elapsedTime: number): void 
    {
        this.elapsedTime = elapsedTime;
        this.timeStep = elapsedTime - this.lastFrame;
        this.lastFrame = elapsedTime;


        if(this.scriptLoop) 
        {
            this.scriptLoop(elapsedTime, this.timeStep);
        }

        this.animationFrameId = requestAnimationFrame((elapsedTime) => this.AnimationLoop(elapsedTime));
    }

    public Update() : void 
    {
        if(this.camera != undefined && this.graphics != undefined && this.scene != undefined) 
        {
            this.graphics.Update(this.scene, this.camera, this.elapsedTime, this.timeStep);
        }
    }

    public Stop(): void 
    {
        cancelAnimationFrame(this.animationFrameId); 

        this.scriptLoop = undefined; 
    }
    
    public scene : Scene = new Scene();
    public camera : PerspectiveCamera | undefined = undefined;
    public graphics : Graphics | undefined = undefined;

    private scriptLoop !: ((elapsedTime :number, timeStep : number) => void) | undefined;
    private animationFrameId : number = 0;
    private lastFrame : number = 0;
    private elapsedTime : number = 0;
    private timeStep : number = 0;

}