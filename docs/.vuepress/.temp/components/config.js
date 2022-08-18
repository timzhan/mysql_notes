import { h } from "vue";
import { defineClientConfig } from "@vuepress/client";
import Badge from "/Users/tuwei/Desktop/mysql-learning/node_modules/vuepress-plugin-components/lib/client/components/Badge";
import FontIcon from "/Users/tuwei/Desktop/mysql-learning/node_modules/vuepress-plugin-components/lib/client/components/FontIcon";
import BackToTop from "/Users/tuwei/Desktop/mysql-learning/node_modules/vuepress-plugin-components/lib/client/components/BackToTop";


export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("Badge", Badge);
    app.component("FontIcon", FontIcon);
    
  },
  setup: () => {
    
  },
  rootComponents: [
    () => h(BackToTop, { threshold: 300 }),
    
  ],
});