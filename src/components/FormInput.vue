<template>
  <div>
    <div class="grid grid-noGutter form-input">
      <slot></slot>
      <div class="col input"><input :type="type" :placeholder="placeholder" :required="required"></slot></div>
    </div>
  </div>
</template>

<script lang="ts">
import * as Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class FormInput extends Vue {
  active: boolean = false;

  // Type attribute of <input>.
  @Prop
  type: string
  // Placeholder attribute of <input>.
  @Prop({ default: ''})
  placeholder: string
  // Required attribute of <input>.
  @Prop({ default: false })
  required: boolean
}
</script>