# LeetCode Stats Box

Hello! Check out sample LeetCode stats/calendar box here.

## Sample

### Solved Problems

| 1                                                 | 2                           |
| ------------------------------------------------- | --------------------------- |
| ![stats with title](/images/stats_with_title.png) | ![stats](/images/stats.png) |

### Submission Calendar

| 1                                                       | 2                                 |
| ------------------------------------------------------- | --------------------------------- |
| ![calendar with title](/images/calendar_with_title.png) | ![calendar](/images/calendar.png) |

This image is generated using the [LeetCode Stats Generator](https://leetcode-solved-problems.vercel.app/). You can easily add your LeetCode statistics to your markdown files using this tool. It's simple to use!

## How to use?

```markdown
![alt text](https://leetcode-solved-problems.vercel.app/api?username={leetcode_id}&name={your_awesome_name})
```

| parameter | required | default      | description                                                                                   |
| --------- | -------- | ------------ | --------------------------------------------------------------------------------------------- |
| username  | true     | `null`       | your LeetCode ID                                                                              |
| name      | false    | `{username}` | name that you'd like displayed on the image (emoji also okay 🐤)                              |
| bolder    | false    | `true`       | (default type) if you don't want to show bolder on the solved problems box, set it to `false` |
| title     | false    | `true`       | if you don't want to show the title on the box, set it to `false`                             |
| type      | false    | `null`       | set it to `calendar` if you want to show the submission calendar                              |

And that's it! You'll get an image like the one above. Add this image to your README.md file or any other markdown document to showcase your coding accomplishments.

### Examples

```markdown
![example stats 1](https://leetcode-solved-problems.vercel.app/api?username={leetcode_id}&name={name_want_to_display})

![example stats 2](https://leetcode-solved-problems.vercel.app/api?username={leetcode_id}&name={name_want_to_display}&bolder=false&title=false)

![example calendar 1](https://leetcode-solved-problems.vercel.app/api?username={leetcode_id}&name={name_want_to_display}&type=calendar)

![example calendar 2](https://leetcode-solved-problems.vercel.app/api?username={leetcode_id}&name={name_want_to_display}&type=calendar&bolder=false&title=false)
```
