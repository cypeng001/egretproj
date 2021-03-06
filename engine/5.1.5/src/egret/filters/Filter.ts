//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class Filter extends HashObject {
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public type:string = null;

        /**
         * @private
         */
        public $id: number = null;


        /**
         * @private 
         */
        public $uniforms:any;

        /**
         * @private 
         */
        protected paddingTop: number = 0;
        /**
         * @private 
         */
        protected paddingBottom: number = 0;
        /**
         * @private 
         */
        protected paddingLeft: number = 0;
        /**
         * @private 
         */
        protected paddingRight: number = 0;
        
        /**
         * @private
         * @native Render
         */
        public $obj: any;

        constructor() {
            super();
            this.$uniforms = {};
            if (egret.nativeRender) {
               egret_native.NativeDisplayObject.createFilter(this);
            }
        }

        /**
         * @private
         */
        public $toJson():string {
            return '';
        }

        protected updatePadding(): void {

        }

        public onPropertyChange(): void {
            let self = this;
            self.updatePadding();
            if (egret.nativeRender) {
                egret_native.NativeDisplayObject.setFilterPadding(self.$id, self.paddingTop, self.paddingBottom, self.paddingLeft, self.paddingRight);
                egret_native.NativeDisplayObject.setDataToFilter(self);
            }
        }

        /*
        add by chenyingpeng
        support filter merge render
        */
        public canMergeRender(): boolean {
            return false;
        }
    }
}