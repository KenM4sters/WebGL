import Assets from "./assets";
import { Graphics } from "./graphics/graphics";
import { Preloader } from "./preloader";
import { Scene } from "./scene/scene";
import { IScript } from "./script";
import { WebGL } from "./webgl";


/**
 * @brief The main entry point for our application. Dragon has instances of the scene, graphics, 
 * script and assets and runs the main game loop.
 */
export class Dragon 
{
    /**
     * @brief Constructs all necessary members (scene, graphics etc...)
     * @param script The scripts that defines an initiaztion and loop function to call.
     */
    constructor(script : IScript) 
    {
        this.script = script;

        this.graphics = new Graphics();
        this.preloader = new Preloader();
        this.assets = Assets.GetInstance();
        this.scene = new Scene(this.graphics); 

        this.assets.LoadAllAssets(() => {
            this.isReady = true;
            script.Initialize(); 
        });

        window.addEventListener("resize", () => this.OnResize());

        if(!this.isReady) 
        {
            this.DrawPreloader();
        }
    }

    public DrawPreloader() : void 
    {

        
        this.preloader.Update(this.elapsedTime, this.timeStep);

        this.animationFrameId = requestAnimationFrame((elapsedTime) => this.AnimationLoop(elapsedTime));
    }

    /**
     * @brief This needs to be called by the initialization function of the IScript instance
     * which gives a callback to the function that will be called each frame.
     * @param callback The loop function to be called each frame.
     */
    public SetAnimationLoop(callback: (elapsedTime: number, timeStep: number) => void): void 
    {
        this.animationCallback = callback;
        this.animationFrameId = requestAnimationFrame((elapsedTime) => this.AnimationLoop(elapsedTime));
    }

    private AnimationLoop(elapsedTime: number): void 
    {
        this.elapsedTime = elapsedTime;
        this.timeStep = elapsedTime - this.lastFrame;
        this.lastFrame = elapsedTime;

        if(this.animationCallback) 
        {
            this.animationCallback(elapsedTime, this.timeStep);
        }

        this.animationFrameId = requestAnimationFrame((elapsedTime) => this.AnimationLoop(elapsedTime));
    }

    /**
     * @brief Updates the graphics member instance.
     */
    public Update() : void 
    {
        if(this.graphics != undefined) 
        {
            this.graphics.Update(this.scene, this.elapsedTime, this.timeStep);
        }
    }

    /**
     * @brief Resizes each member instance whenver the window is resized.
     */
    public OnResize(): void 
    {
        let newWidth = window.innerWidth;
        let newHeight = window.innerHeight;

        let canvas = WebGL.GetInstance().canvas;

        if(canvas.width != newWidth || canvas.height != newHeight) 
        {
            canvas.width = newWidth;
            canvas.height = newHeight;

            this.scene.Resize(canvas.width, canvas.height);
            this.graphics.Resize(canvas.width, canvas.height);
        }
    }   

    public Stop(): void 
    {
        cancelAnimationFrame(this.animationFrameId); 

        this.animationCallback = undefined; 
    }

    
    public script : IScript;
    public graphics : Graphics;
    public assets : Assets;
    public scene : Scene;
    public preloader : Preloader;
    
    public IsLoading : boolean = true;

    private animationCallback !: ((elapsedTime :number, timeStep : number) => void) | undefined;
    private animationFrameId : number = 0;
    private lastFrame : number = 0;
    private elapsedTime : number = 0;
    private timeStep : number = 0;
    private isReady : boolean = false;

}