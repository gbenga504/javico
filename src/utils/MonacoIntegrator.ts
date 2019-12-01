import Constants from './Constants';

interface IMonacoConfig {
  MONACO_INTEGRATOR_LOADER_URL: string;
  MONACO_INTEGRATOR_BASE_URL: string;
}

declare global {
  interface Window {
    monaco: any;
  }
}

class MonacoIntegrator {
  private config: IMonacoConfig;
  private reject: (reason?: any) => void;
  private resolve: (value: unknown) => void;

  constructor(config: IMonacoConfig) {
    this.config = config;
    this.reject = () => {};
    this.resolve = () => {};
  }

  private handleMonacoEditorLoadedState() {
    document.removeEventListener('monaco_editor_init', this.handleMonacoEditorLoadedState);
    this.resolve(window.monaco);
  }

  private createScript(src?: string) {
    let script = document.createElement('script');
    return src ? (script.setAttribute('src', src), script) : script;
  }

  private injectScriptIntoBody(script: HTMLScriptElement) {
    document.body.appendChild(script);
  }

  private createLoaderScript(mainScript: HTMLScriptElement) {
    let loaderScript = this.createScript(this.config.MONACO_INTEGRATOR_LOADER_URL);
    loaderScript.onload = () => this.injectScriptIntoBody(mainScript);
    loaderScript.onerror = (event: string | Event) => this.reject(event);
    return loaderScript;
  }

  private createMainScript() {
    let mainScript = this.createScript();
    mainScript.innerHTML = `
            require.config({ paths: { 'vs': '${this.config.MONACO_INTEGRATOR_BASE_URL}' }});
            require(['vs/editor/editor.main'], function() {
                document.dispatchEvent(new Event('monaco_editor_init'));
            })
        `;
    mainScript.onerror = (event: string | Event) => this.reject(event);
    return mainScript;
  }

  public init() {
    if (window.monaco && window.monaco.editor) {
      return new Promise<void>(resolve => resolve(window.monaco));
    }
    document.addEventListener('monaco_editor_init', this.handleMonacoEditorLoadedState.bind(this));
    let mainScript = this.createMainScript();
    this.injectScriptIntoBody(this.createLoaderScript(mainScript));
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export default new MonacoIntegrator(Constants.URLS);
