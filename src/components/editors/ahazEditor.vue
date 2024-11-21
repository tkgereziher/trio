<template>
  <div>
    <!-- Fixed Toolbar -->
    <div class="fixed-toolbar">
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('bold')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-bold</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('italic')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-italic</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<p>')"
        variant="text"
        color="#14414b"
        v-if="tools && tools.includes('p')"
      >
        <v-icon>mdi-format-paragraph</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h1>')"
        variant="text"
        color="#14414b"
        v-if="tools && tools.includes('h1')"
      >
        <v-icon>mdi-format-header-1</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h2>')"
        variant="text"
        color="#14414b"
        v-if="tools && tools.includes('h2')"
      >
        <v-icon>mdi-format-header-2</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h3>')"
        variant="text"
        color="#14414b"
        v-if="tools && tools.includes('h3')"
      >
        <v-icon>mdi-format-header-3</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('insertOrderedList')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('insertUnorderedList')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="insertImage"
        variant="text"
        color="#14414b"
        v-if="tools && tools.includes('img')"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <!-- <v-btn
        class="mx-0 px-0"
        icon
        @click="
          saveSelection();
          openLinkPrompt();
        "
        variant="text"
        color="#632097"
      >
        <v-icon>mdi-link-variant</v-icon>
      </v-btn> -->
      <!-- <v-btn
        class="mx-0 px-0"
        icon
        @click="
          saveSelection();
          openYouTubePrompt();
        "
        variant="text"
        color="red"
      >
        <v-icon>mdi-youtube</v-icon>
      </v-btn> -->
    </div>

    <!-- Floating Toolbar (Contextual) -->
    <div
      v-if="showFloatingToolbar && 1 != 1"
      class="floating-toolbar"
      :style="{
        top: `${toolbarPosition.top}px`,
        left: `${toolbarPosition.left}px`,
      }"
    >
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('bold')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-bold</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('italic')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-italic</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<p>')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-paragraph</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h1>')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-header-1</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h2>')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-header-2</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('formatBlock', '<h3>')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-header-3</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('insertOrderedList')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-list-numbered</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="execCommand('insertUnorderedList')"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-format-list-bulleted</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="insertImage"
        variant="text"
        color="#14414b"
      >
        <v-icon>mdi-image</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="
          saveSelection();
          openLinkPrompt();
        "
        variant="text"
        color="#632097"
      >
        <v-icon>mdi-link-variant</v-icon>
      </v-btn>
      <v-btn
        class="mx-0 px-0"
        icon
        @click="
          saveSelection();
          openYouTubePrompt();
        "
        variant="text"
        color="red"
      >
        <v-icon>mdi-youtube</v-icon>
      </v-btn>
    </div>

    <div
      class="editor"
      contenteditable="true"
      ref="editor"
      @mouseup="showToolbarAtSelection"
      @keyup="showToolbarAtSelection"
      @input="updateContent"
    ></div>

    <!-- Custom Prompt Components -->
    <custom-prompt
      ref="linkPrompt"
      title="Insert Link"
      urlLabel="Enter URL"
      hasLabel
      labelText="Enter Label"
    />
    <custom-prompt
      ref="youtubePrompt"
      title="Insert YouTube Video"
      urlLabel="Enter YouTube URL"
    />
  </div>
</template>

<script>
import CustomPrompt from "@/components/customPrompt.vue";
export default {
  name: "AhazEditor",
  props: ["modelValue", "isUpdated", "tools"],
  emits: ["update:modelValue"],
  components: {
    CustomPrompt,
  },
  data() {
    return {
      value: this.modelValue,
      content: this.modelValue,
      savedSelection: null,
      showFloatingToolbar: false,
      toolbarPosition: { top: 0, left: 0 },
    };
  },
  mounted() {
    this.$refs.editor.innerHTML = this.modelValue;
  },
  methods: {
    showToolbarAtSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Ensure toolbar appears above the selected line
        if (!selection.isCollapsed) {
          // Only show toolbar if text is selected
          this.toolbarPosition.top = rect.top + window.scrollY - 70;
          this.toolbarPosition.left = rect.left + window.scrollX - 40;
          this.showFloatingToolbar = true;
        } else {
          this.showFloatingToolbar = false; // Hide the toolbar if no text is selected
        }
      }
    },
    saveSelection() {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        this.savedSelection = selection.getRangeAt(0);
      }
    },
    restoreSelection() {
      if (this.savedSelection) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.savedSelection);
      }
    },
    execCommand(command, value = null) {
      document.execCommand(command, false, value);
      this.updateContent();
      this.showFloatingToolbar = false; // Hide the floating toolbar after the command is executed
    },
    updateContent() {
      this.content = this.$refs.editor.innerHTML;
      this.$emit("update:modelValue", this.content);
    },
    insertImage() {
      const url = prompt("Enter the image URL");
      if (url) {
        execCommand("insertImage", url);
      }
    },

    async openLinkPrompt() {
      try {
        const { url, label } = await this.$refs.linkPrompt.open();
        this.insertLink(url, label);
      } catch {
        // Handle the cancel action
      }
    },

    insertLink(url, label) {
      if (url) {
        const linkLabel =
          label ||
          (this.savedSelection && this.savedSelection.toString()) ||
          url;

        // Restore the saved selection
        this.restoreSelection();

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const anchor = document.createElement("a");
          anchor.href = url;
          anchor.target = "_blank"; // Open in a new tab
          anchor.textContent = linkLabel;

          // Remove the current contents of the range and insert the link
          range.deleteContents();
          range.insertNode(anchor);

          // Move the cursor right after the inserted link
          range.setStartAfter(anchor);
          range.collapse(true);

          // Clear the current selection and set the new range
          selection.removeAllRanges();
          selection.addRange(range);

          this.updateContent(); // Update the editor content
        } else {
          alert("No valid selection range found.");
        }
      }
    },

    async openYouTubePrompt() {
      try {
        const { url } = await this.$refs.youtubePrompt.open();
        this.insertYouTubeVideo(url);
      } catch {
        // Handle the cancel action
      }
    },

    insertYouTubeVideo(url) {
      if (url) {
        const videoId = this.extractYouTubeVideoId(url);
        if (videoId) {
          const iframe = document.createElement("iframe");
          // iframe.src = `https://www.youtube.com/embed/${videoId}`;
          iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=1&disablekb=1`;

          iframe.frameBorder = "0";
          iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
          iframe.allowFullscreen = true;

          // Apply responsive class
          iframe.className = "editor-video";

          // Restore the selection before inserting the iframe
          this.restoreSelection();

          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents(); // Remove selected content if any
            range.insertNode(iframe); // Insert the iframe
            selection.removeAllRanges(); // Clear selection
            selection.addRange(range); // Reselect the range (optional)
            this.updateContent(); // Update the editor content
          } else {
            alert("No valid selection range found.");
          }
        } else {
          alert("Invalid YouTube URL");
        }
      }
    },

    extractYouTubeVideoId(url) {
      const regExp =
        /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
      const match = url.match(regExp);
      return match && match[2].length === 11 ? match[2] : null;
    },
  },
  watch: {
    isUpdated() {
      this.$refs.editor.innerHTML = this.modelValue;
    },
    modelValue(newValue) {
      if (newValue !== this.content) {
        this.content = newValue;
        this.$nextTick(() => {
          this.$refs.editor.innerHTML = this.content || ""; // Update the contenteditable div manually
        });
      }
    },
  },
};
</script>

<style scoped>
/* Fixed Toolbar */
.fixed-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #eee;
  padding: 8px;
  display: flex;
  gap: 8px;
}

/* Floating/Contextual Toolbar */
.floating-toolbar {
  position: absolute;
  z-index: 1000;
  background: #eee;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 8px;
}

.editor {
  border: 1px solid #ddd;
  padding: 10px;
  min-height: 100px;
  overflow: auto;
  margin-top: 0px; /* Added margin to separate editor from fixed toolbar */
}
</style>
