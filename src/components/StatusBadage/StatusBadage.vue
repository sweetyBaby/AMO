<template>
  <a-badge :status="statusFilter(status)" :text="textFilter(status)" />
</template>

<script>
export default {
  name: 'StatusBadage',
  props: ['status', 'statusMap'],
  methods: {
    statusFilter(arg) {
      return this.statusMap[arg].status
    },
    textFilter(arg) {
      return this.statusMap[arg].text
    }
  }
}
</script>
