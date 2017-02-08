import Vue from 'vue'
import Component from 'vue-class-component'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave'
])