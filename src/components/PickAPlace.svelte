<script>
  import { onMount, setContext } from 'svelte';
  import { LEAFLET_CTX } from '../constants';
  import LeafletPositionPicker from './LeafletPositionPicker.svelte';

  export let leaflet;
  export let lat = 33;
  export let lng = -112;
  export let zoom = 10;
  export let guideOverlay = true;
  export let buttons = true;
  export let selectionModes = ['point', 'polygon'];
  export let selection = null;

  setContext(LEAFLET_CTX, {
    getMap: () => map,
    getLeaflet: () => leaflet
  });

  let mapElement;
  let map;
  let selectionMode = null;

  if (selection != null && typeof selection !== 'object') {
    throw new Error('The value of "selection" must be an object');
  }

  if (selection != null) {
    const type = selection.geometry.type.toLowerCase();
    if (!selectionModes.includes(type)) {
      throw new Error(
        `The provided default selection object has a geometry of type ${type}, which is not included in the allowed selection modes`
      );
    }
    selectionMode = type;
  }

  onMount(() => {
    if (leaflet == null) {
      throw new Error('No Leaflet instance was provided.');
    }

    map = leaflet.map(mapElement).setView([lat, lng], zoom);
    leaflet
      .tileLayer('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxZoom: 18
      })
      .addTo(map);
  });
</script>

<style>
  .pick-a-place {
    width: 100%;
    height: 100%;
  }

  :global(.pick-a-place__overlay-container) {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 401;
    pointer-events: none;
  }

  :global(.pick-a-place__overlay-content) {
    position: relative;
    width: 100%;
    height: 100%;
  }

  :global(.pick-a-place__button) {
    font-size: 1rem;
    font-family: inherit;
    overflow: visible;
    text-transform: none;
    margin-bottom: 5px;
    padding: 0.5em;
    background-color: #fff;
    border-radius: 2px;
    border: 2px solid rgba(0, 0, 0, 0.2);
    padding: 5px;
  }

  :global(.pick-a-place__button.active) {
    font-weight: bold;
  }

  :global(.pick-a-place__button:hover:not([disabled])) {
    cursor: pointer;
    background: #eee;
  }
</style>

<div class="pick-a-place" bind:this={mapElement}>

  <div class="pick-a-place__overlay-container">
    <div class="pick-a-place__overlay-content">
      <slot />
      {#if map}
        <LeafletPositionPicker
          {guideOverlay}
          {buttons}
          {selection}
          {selectionModes}
          {selectionMode}
          on:update
          on:save
          on:cancel />
      {/if}
    </div>
  </div>

</div>
