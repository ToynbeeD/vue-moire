<template>
  <div class="fail-load">
    <h2 class="fail-load__heading">Что-то пошло не так...</h2>
    <button class="fail-load__btn" @click="method()" type="button">Попробуйте ещё раз</button>
  </div>
</template>

<style>
  .fail-load {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .fail-load__heading {
    font-size: 36px;
    color: #222;
  }
  .fail-load__btn {
    padding: 20px 15px;
    font-size: 20px;
    line-height: 20px;
    color: #fff;
    border: none;
    background-color: #e02d71;
    cursor: pointer;
    transition: background-color .2s linear;
  }
  .fail-load__btn:hover:not(:active) {
    background-color: #af255a;
  }
  .fail-load__btn:active {
    background-color: #d40e5a;
  }
</style>

<script>
export default {
  props: ['method']
}
</script>
