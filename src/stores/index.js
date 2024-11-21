
import { reactive } from 'vue'

export const store = reactive({
     categories: [
        {
          code: "C001",
          name: "Pinia",
          description: "Pinia"
        },
        {
          code: "C002",
          name: "Reactive",
          description: "Reactive"
        },
      ],
      tags: [
        {
          code: "T001",
          name: "Pinia",
          description: "Pinia"
        },
        {
          code: "T002",
          name: "Reactive",
          description: "Reactive"
        },
      ]
})