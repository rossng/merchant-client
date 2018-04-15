<template>
    <div id="observables">
        <h2>Observables</h2>
        <DeployObservable />
        <ObservablesList/>
    </div>
</template>

<script>
    import DeployObservable from "./DeployObservable";
    import ObservablesList from './ObservablesList'
    export default {
        name: 'Observables',
        components: {DeployObservable, ObservablesList}
    }
</script>

<style scoped>
    #observables {
        border: 1px solid grey;
        margin: 10px;
        padding: 10px;
    }
</style>
