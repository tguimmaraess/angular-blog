import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextEditorService } from './text-editor.service';
/*
  or copy the content of src/ckeditor and paste into node_modules/ckeditor/ckeditor5-build-classic
  and use the import below
  //import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
  Note that typings.d.ts also has to change to @ckeditor/ckeditor5-build-classic
  to match the location of the build
*/
import * as ClassicEditor from '../../../../ckeditor-build/';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.css']
})
export class TextEditorComponent implements OnInit {

  public Editor = ClassicEditor;
  public config: any;
  public textEditorData: FormControl = new FormControl('');//Form control to get the content of the text editor

  constructor(private textEditorService: TextEditorService) {}

  //Sends the text editor content to the parent component (whatever component is importing this text editor)
  @Output() article: EventEmitter<any> = new EventEmitter<any>();

  //Recieves text editor data (content) from EditArticle Component
  @Input() textEditorDataEdit: string =  '';

  ngOnInit(): void {

   //Editor config
    this.config = {
      allowedContent: {
        img: {
          attributes: [ '!src', 'alt', 'width', 'height' ],
          classes: { tip: true }
        },
      },
     placeholder: 'Start writting your article',
     toolbar: {
       items: [
         'heading',
         'alignment',
         'bold',
         'fontSize',
         'FontFamily',
         'italic',
         'link',
         'bulletedList',
         'numberedList',
         'imageUpload',
         'mediaEmbed',
         'blockQuote',
         'undo',
         'redo',
       ],
     },
     image: {
       toolbar: [
         'imageResize',
         'imageStyle:full',
         'imageStyle:inline',
         'imageStyle:block',
         'imageStyle:side',
         '|',
         'imageTextAlternative'
       ]
     },
     language: 'en'
   };
    //Fills in the text editor with article content from edit-article component
    this.textEditorData.setValue(this.textEditorDataEdit);
  }

  //When text editor data is modifed, this function is called
  onChange({editor}: ChangeEvent): void {
    //Emits an event which is received by the component that uses TextEditor Component
    this.article.emit(this.textEditorData.value);
  }

}
