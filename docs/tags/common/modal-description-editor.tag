<modal-description-editor>
    <div class="modal {isActive()}">
        <div class="modal-background"></div>
        <div class="modal-content" style="width: 88vw;">

            <div class="card">
                <div class="card-content" style="height: 88vh;">

                    <div style="display:flex; height: 100%; width: 100%;flex-direction: column;" >

                        <div style="margin-bottom:11px;">
                            <h1 class="title is-4">{title()} の Description の変更</h1>
                        </div>

                        <div style="display:flex; flex-grow: 1">

                            <div style="flex-grow: 1;margin-right: 8px;">
                                <div class="element-container">
                                    <h1 class="title is-5">Markdown</h1>
                                    <textarea class="input"
                                              ref="description"
                                              onkeyup={inputDescription}>{description()}</textarea>
                                </div>
                            </div>

                            <div style=";flex-grow: 1;margin-left: 8px;">
                                <div class="element-container">
                                    <h1 class="title is-5">Preview</h1>
                                    <div class="preview" style="padding: 0px 11px 11px 11px;">
                                        <markdown-preview  data={marked(markdown)}></markdown-preview>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top:11px;">
                            <button class="button is-warning" onclick={clickCancel}>Cancel</button>

                            <button class="button is-danger"
                                    style="float:right;"
                                    onclick={clickSave}>Save</button>
                        </div>
                    </div>


                </div>
            </div>

        </div>
    </div>

    <script>
     this.markdown = null;
    </script>

    <script>
     this.clickCancel = () => {
         this.opts.callback('close-modal-description-editor');
     };
     this.clickSave = () => {
         this.opts.callback('save-column-instance-description', {
             object: this.opts.data,
             value: this.refs['description'].value,
         });
     };
     this.inputDescription = () => {
         this.markdown = this.refs['description'].value;

         this.tags['markdown-preview'].update();
     };
    </script>

    <script>
     this.description = () => {
         if (!this.markdown) {
             let obj = this.opts.data;

             this.markdown = !obj ? '' : obj.description;
         }

         return this.markdown;
     };
     this.title = () => {
         if (!this.opts.data)
             return '';

         let obj = this.opts.data;
         return obj._class + ':' + obj.name;
     };
     this.isActive = () => {
         return this.opts.data ? 'is-active' : '';
     };
    </script>

    <style>
     modal-description-editor .element-container {
         display:flex;
         height: 100%;
         width: 100%;
         flex-direction: column;
     }
     modal-description-editor .element-container .title{
         margin-bottom:6px;
     }
     modal-description-editor .input {
         border: 1px solid #eeeeee;
         padding: 11px;
         box-shadow: none;
         height: 100%;
         width: 100%;
     }
     modal-description-editor .preview {
         border: 1px solid #eeeeee;
         flex-grow:1;
     }
    </style>
</modal-description-editor>
